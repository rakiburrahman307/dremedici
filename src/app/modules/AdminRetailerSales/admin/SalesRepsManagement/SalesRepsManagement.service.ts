import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import { User } from '../../../user/user.model';
import { IUser } from '../../../user/user.interface';
import { USER_ROLES } from '../../../../../enums/user';
import QueryBuilder from '../../../../builder/QueryBuilder';
import config from '../../../../../config';
import Order from '../orderManagement/orderManagement.model';
import mongoose from 'mongoose';
import { SubscriptionPurchase } from '../../retailer/subscriptionPurchase/subscription.purchase.model';
import { IAddUser } from './SalesRepsManagement.interface';
import { SubscriptionPlan } from '../subscription/subscription.model';

const calculateCommitions = async (id: string) => {
     const result = await Order.aggregate([
          {
               $match: {
                    _id: new mongoose.Types.ObjectId(id),
               },
          },
          {
               $group: {
                    _id: null,
                    totalAmount: { $sum: '$totalAmount' }, // Sum of all order total amounts
                    commission: {
                         $sum: {
                              $multiply: ['$totalAmount', 0.1], // 10% commission based on totalAmount for each order
                         },
                    },
               },
          },
     ]);

     const totalAmount = result.length ? result[0].totalAmount : 0;
     const totalCommission = result.length ? result[0].commission : 0;

     return {
          totalAmount,
          totalCommission,
     };
};
const calculateCommitionsSales = async (object: { _id: string }[]) => {
     // Convert _id to mongoose ObjectId rather than string
     const storeIds = object.map((id) => new mongoose.Types.ObjectId(id._id));

     const result = await Order.aggregate([
          {
               $match: {
                    userId: { $in: storeIds }, // Match orders where _id is in the storeIds array
               },
          },
          {
               $group: {
                    _id: null,
                    totalAmount: { $sum: '$totalAmount' }, // Sum of all order total amounts
                    commission: {
                         $sum: {
                              $multiply: ['$totalAmount', 0.1], // 10% commission based on totalAmount for each order
                         },
                    },
               },
          },
     ]);

     // Safely access the result, defaulting to 0 if no data is found
     const totalAmount = result.length ? result[0].totalAmount : 0;
     const totalCommission = result.length ? result[0].commission : 0;

     return {
          totalAmount,
          totalCommission,
     };
};

const getTotalBoxCanRetailerOrder = async (id: string) => {
     try {
          const result = await Order.aggregate([
               {
                    $match: {
                         userId: new mongoose.Types.ObjectId(id),
                    },
               },
               {
                    $unwind: '$products',
               },
               {
                    $group: {
                         _id: null,
                         totalQuantity: { $sum: '$products.quantity' },
                         totalAmount: { $sum: '$totalAmount' },
                    },
               },
          ]);

          // If no order result is found, set defaults
          const totalQuantity = result.length ? result[0].totalQuantity : 0;
          const totalAmount = result.length ? result[0].totalAmount : 0;

          // Fetch the user's subscription tier
          const subscription = await SubscriptionPurchase.findOne({
               userId: new mongoose.Types.ObjectId(id),
          });

          // Determine tier based on subscription status
          const tier = subscription ? subscription.tier : 'free';

          return {
               totalQuantity,
               totalAmount,
               tier,
          };
     } catch (error) {
          console.error('Error fetching retailer order total:', error);
          throw new Error('Unable to retrieve order data');
     }
};

const getSalesReps = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(User.find({ role: USER_ROLES.SALES, verifiedByAdmin: true }).populate('assignedRetailers', 'name'), query);

     const result = await queryBuilder.filter().sort().paginate().fields().search(['name', 'email']).modelQuery;

     const meta = await queryBuilder.countTotal();
     const productsWithStatus = await Promise.all(
          result?.map(async (user: any) => {
               const orderCount = await calculateCommitionsSales(user.assignedRetailers);
               return {
                    ...user.toObject(),
                    totalSales: orderCount.totalAmount,
                    commission: orderCount.totalCommission,
                    // tier: orderCount.tier,
               };
          }),
     );
     return {
          meta,
          result: productsWithStatus,
     };
};
const getSalesRepsById = async (id: string) => {
     const result = await User.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
     }
     return result;
};
const getUnapprovedSalesReps = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(User.find({ role: USER_ROLES.SALES, verifiedByAdmin: false }), query);

     const result = await queryBuilder.filter().sort().paginate().fields().search(['name', 'email']).modelQuery;

     const meta = await queryBuilder.countTotal();
     return {
          meta,
          result,
     };
};

const aprovedSalesRepByAdmin = async (id: string) => {
     const isExist = await User.findById(id);
     if (!isExist) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
     }
     if (isExist.role !== USER_ROLES.SALES) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User is not a sales rep!');
     }
     const result = await User.findOneAndUpdate({ _id: id }, { verifiedByAdmin: true }, { new: true });
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update aproved!');
     }
     return result;
};
const getUnassignRetailer = async () => {
     const result = await User.find({ assignedSalesRep: null });
     if (!result) {
          return [];
     }
     return result;
};
const addedSalesRep = async (payload: Partial<IUser>) => {
     const data = {
          ...payload,
          password: config.default_pass,
          role: USER_ROLES.SALES,
          verified: true,
          verifiedByAdmin: true,
     };
     const result = await User.create(data);
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create sales rep!');
     }
     return result;
};

const salesRepAnalysis = async (id: string) => {
     // Check if the user exists
     const isExistUser = await User.findById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
     }

     // Find the total number of sales representatives
     const totalSales = await User.countDocuments({ role: USER_ROLES.SALES });

     // Get orders for assigned retailers, matching the user's assigned retailers
     const salesRepOrders = await Order.find({
          userId: { $in: isExistUser.assignedRetailers },
     });

     // Calculate the total number of orders and the total order amount
     const totalOrderCount = salesRepOrders.length;

     // Calculate the commission for each order (10% of the totalAmount)
     const commissionRate = 0.1; // 10% commission
     const totalCommission = salesRepOrders.reduce((acc, order) => {
          return acc + order.totalAmount * commissionRate; // Add 10% commission for each order
     }, 0);

     // Calculate the total order amount
     const totalOrderAmount = salesRepOrders.reduce((acc, order) => acc + order.totalAmount, 0);

     // Return the analysis results along with the commission
     return {
          totalSales,
          totalOrderCount,
          totalOrderAmount,
          totalCommission, // The 10% commission calculated from each order
     };
};
const getSalesRepRetailers = async (id: string, query: Record<string, unknown>) => {
     const isExistUser = await User.findById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
     }
     const queryBuilder = new QueryBuilder(
          User.find({
               _id: { $in: isExistUser.assignedRetailers },
          }).populate('assignedSalesRep', 'name'),
          query,
     );
     const result = await queryBuilder.filter().sort().paginate(5).fields().search(['name', 'email']).modelQuery;
     const meta = await queryBuilder.countTotal();
     // Modify this block to also include cart status
     const productsWithStatus = await Promise.all(
          result?.map(async (user: any) => {
               const orderCount = await getTotalBoxCanRetailerOrder(user._id.toString());
               console.log('first');
               return {
                    ...user.toObject(),
                    totalBox: orderCount.totalQuantity,
                    totalAmount: orderCount.totalAmount,
                    tier: orderCount.tier,
               };
          }),
     );

     return { productsWithStatus, meta };
};
const getSalesRepCommission = async (id: string, query: Record<string, unknown>) => {
     const isExistUser = await User.findById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
     }

     const queryBuilder = new QueryBuilder(
          Order.find({
               userId: { $in: isExistUser.assignedRetailers },
          }),
          query,
     );
     const result = await queryBuilder.filter().sort().paginate(5).fields().search(['name', 'email']).modelQuery;
     const meta = await queryBuilder.countTotal();

     const productsWithStatus = await Promise.all(
          result?.map(async (order: any) => {
               const orderCount = await calculateCommitions(order._id.toString());

               return {
                    ...order.toObject(),
                    totalAmount: orderCount.totalAmount,
                    commission: orderCount.totalCommission,
               };
          }),
     );
     return { productsWithStatus, meta };
};
const addRetailerToSalesRep = async (salesRepId: string, payload: IAddUser) => {
     const { name, email, address, card } = payload;

     // Start a session for the transaction
     const session = await mongoose.startSession();
     session.startTransaction();

     try {
          // Prepare user data for retailer creation
          const data = {
               name,
               email,
               address,
               password: config.default_pass,
               role: USER_ROLES.RETAILER,
               verified: true,
               verifiedByAdmin: true,
          };

          // Create the retailer user
          const addUser = await User.create([data], { session });
          if (!addUser || addUser.length === 0) {
               throw new Error('Failed to create retailer!');
          }

          // Update the sales representative with the new retailer
          const result = await User.findOneAndUpdate({ _id: salesRepId }, { $push: { assignedRetailers: addUser[0]._id } }, { new: true, session });
          if (!result) {
               throw new Error('Failed to update retailer!');
          }

          // Check for active subscriptions
          const subscription = await SubscriptionPlan.find({ status: 'active' }, null, { session });
          if (!subscription || subscription.length === 0) {
               throw new AppError(StatusCodes.NOT_FOUND, 'No active subscription available!');
          }

          const subscriptionData = subscription[0]; // You could modify this logic if there are multiple subscriptions and you need to select one
          const subscriptionPurchaseData = {
               userId: addUser[0]._id,
               tier: subscriptionData.tier,
               subscription: subscriptionData.subscription,
               freeShipping: subscriptionData.freeShipping,
               noCreditCardFee: subscriptionData.noCreditCardFee,
               exclusiveProducts: subscriptionData.exclusiveProducts,
               limitedReleases: subscriptionData.limitedReleases,
               termsAndConditionsAccepted: true,
               card,
          };

          // Create a subscription purchase for the retailer
          const subscriptionPurchase = await SubscriptionPurchase.create([subscriptionPurchaseData], {
               session,
          });
          if (!subscriptionPurchase || subscriptionPurchase.length === 0) {
               throw new Error('Failed to create subscription purchase!');
          }

          // Commit the transaction
          await session.commitTransaction();
          session.endSession();

          return result;
     } catch (error) {
          // If anything fails, abort the transaction and handle the error
          await session.abortTransaction();
          session.endSession();
          throw new AppError(StatusCodes.BAD_REQUEST, (error as Error).message || 'Failed to add retailer!');
     }
};
const getRetailerDetails = async (id: string) => {
     const result = await SubscriptionPurchase.findOne({ userId: id }).populate({
          path: 'userId',
          select: 'name email address assignedSalesRep',

          populate: {
               path: 'assignedSalesRep',
               select: 'name email',
          },
     });
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
     }
     return result;
};
const removeRetailerFromSales = async (salesId: string, retailerId: string) => {
     const session = await mongoose.startSession();
     session.startTransaction();

     try {
          // Convert IDs to ObjectId
          const salesIdObject = new mongoose.Types.ObjectId(salesId);
          const retailerIdObject = new mongoose.Types.ObjectId(retailerId);

          // Validate if both users exist (sales rep and retailer)
          const [salesRep, retailer] = await Promise.all([
               User.findById(salesIdObject).session(session),
               User.findById(retailerIdObject).session(session),
          ]);

          if (!salesRep || !retailer) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'User(s) not found!');
          }

          // Fix property name: assignedRetailer -> assignedRetailers
          if (!Array.isArray(salesRep.assignedRetailers)) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Sales rep has no assigned retailers array!');
          }

          // Check if the retailerId exists in the assignedRetailers array using proper ObjectId comparison
          const retailerExists = salesRep.assignedRetailers.some((rId: mongoose.Types.ObjectId) => rId.equals(retailerIdObject));

          if (!retailerExists) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Retailer is not assigned to this sales rep!');
          }

          // Pull retailer from the sales rep's list and update retailer's assignedSalesRep
          const [updatedSalesRep, updatedRetailer] = await Promise.all([
               User.findOneAndUpdate(
                    { _id: salesIdObject },
                    { $pull: { assignedRetailers: retailerIdObject } }, // Fixed field name
                    { new: true, session },
               ),
               User.findOneAndUpdate({ _id: retailerIdObject }, { $set: { assignedSalesRep: null } }, { new: true, session }),
          ]);

          if (!updatedSalesRep || !updatedRetailer) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update users!');
          }

          // Commit the transaction
          await session.commitTransaction();

          return updatedRetailer; // Return the updated retailer
     } catch (error) {
          // Abort the transaction if any error occurs
          await session.abortTransaction();
          throw error; // Rethrow the error for handling in the calling code
     } finally {
          // End the session after completion
          session.endSession();
     }
};
const deleteSalesRep = async (id: string) => {
     const result = await User.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
     }
     const removeRetailer = await User.updateMany({ assignedSalesRep: result._id }, { $set: { assignedSalesRep: null } });
     if (!removeRetailer) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update users!');
     }
     const result1 = await User.findByIdAndDelete(id);
     if (!result1) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete user!');
     }
     return result1;
};
export const SalesRepsManagementService = {
     aprovedSalesRepByAdmin,
     getUnapprovedSalesReps,
     addedSalesRep,
     getUnassignRetailer,
     getSalesReps,
     getSalesRepsById,
     salesRepAnalysis,
     getSalesRepRetailers,
     getSalesRepCommission,
     addRetailerToSalesRep,
     getRetailerDetails,
     removeRetailerFromSales,
     deleteSalesRep,
};
