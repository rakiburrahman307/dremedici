import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../../user/user.model';
import { USER_ROLES } from '../../../../../enums/user';
import AppError from '../../../../../errors/AppError';
import config from '../../../../../config';
import { SubscriptionPlan } from '../subscription/subscription.model';
import { SubscriptionPurchase } from '../../retailer/subscriptionPurchase/subscription.purchase.model';
import QueryBuilder from '../../../../builder/QueryBuilder';
import Order from '../orderManagement/orderManagement.model';

interface IUserOrderSummary {
     salesRepId?: string;
     name?: string;
     address?: string;
     card?: {
          cardHolderName: string;
          cardNumber: string;
          expiryDate: string;
          cvv: string;
          zipCode: string;
     };
}

const getUserOrderSummary = async (userId: string) => {
     if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID');
     }

     const id = new mongoose.Types.ObjectId(userId);

     // Aggregate orders for totals
     const result = await Order.aggregate([
          { $match: { userId: id } },
          {
               $group: {
                    _id: '$userId',
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                    totalProducts: { $sum: { $size: '$products' } },
               },
          },
     ]);

     // Check subscription status
     const percessSubscription = await SubscriptionPurchase.findOne({
          userId: id,
     });
     const subscriptionActive = Boolean(percessSubscription);
     const status = subscriptionActive ? 'active' : 'inactive';

     // Compose final result
     return {
          totalSales: result[0]?.totalSales || 0,
          orderCount: result[0]?.orderCount || 0,
          totalProducts: result[0]?.totalProducts || 0,
          subscriptionStatus: status,
     };
};

const getAllRetailers = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(User.find({ role: USER_ROLES.RETAILER }), query);

     const result = await queryBuilder
          .filter()
          .sort()
          .paginate()
          .fields()
          .search(['name', 'email'])
          .modelQuery.populate({ path: 'assignedSalesRep', select: 'name email' })
          .exec();

     const meta = await queryBuilder.countTotal();

     const productsWithStatus = await Promise.all(
          result?.map(async (order: any) => {
               const analysis = await getUserOrderSummary(order._id.toString());

               return {
                    ...order.toObject(),
                    totalSales: analysis.totalSales,
                    totalOrder: analysis.orderCount,
                    totalProducts: analysis.totalProducts,
                    subscriptionStatus: analysis.subscriptionStatus,
               };
          }),
     );

     return {
          meta,
          result: productsWithStatus,
     };
};

const getSingleRetailer = async (id: string) => {
     const retailer = await User.findOne({ _id: id, role: USER_ROLES.RETAILER })
          .populate('assignedSalesRep', 'name email')
          .select('name email address assignedSalesRep');

     if (!retailer) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Retailer not found');
     }
     const getCard = await SubscriptionPurchase.findOne({ userId: retailer._id });

     const fakeCard = {
          cardHolderName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          zipCode: '',
     };
     const card = getCard?.card ? getCard.card : fakeCard;
     const data = {
          retailer,
          card,
     };
     return data;
};

const createRetailer = async (payload: {
     salesRepId?: string;
     name: string;
     email: string;
     address: string;
     card?: {
          cardHolderName: string;
          cardNumber: string;
          expiryDate: string;
          cvv: string;
          zipCode: string;
     };
}) => {
     const session = await mongoose.startSession();
     session.startTransaction();

     try {
          const { name, email, address, card } = payload;

          // Create retailer user
          const userData = {
               name,
               email,
               address,
               password: config.default_pass,
               role: USER_ROLES.RETAILER,
               verified: true,
               verifiedByAdmin: true,
               assignedSalesRep: new mongoose.Types.ObjectId(payload.salesRepId),
          };

          const [retailer] = await User.create([userData], { session });

          // Get active subscription
          const subscription = await SubscriptionPlan.findOne({ status: 'active' }, null, { session });

          if (!subscription) {
               throw new AppError(StatusCodes.NOT_FOUND, 'No active subscription plan found');
          }

          // Create subscription purchase
          const subscriptionPurchaseData = {
               userId: retailer._id,
               tier: subscription.tier,
               subscription: subscription.subscription,
               freeShipping: subscription.freeShipping,
               noCreditCardFee: subscription.noCreditCardFee,
               exclusiveProducts: subscription.exclusiveProducts,
               limitedReleases: subscription.limitedReleases,
               termsAndConditionsAccepted: true,
               card,
          };

          await SubscriptionPurchase.create([subscriptionPurchaseData], { session });

          await session.commitTransaction();
          return retailer;
     } catch (error) {
          await session.abortTransaction();
          throw error;
     } finally {
          session.endSession();
     }
};

const updateRetailer = async (id: string, payload: IUserOrderSummary) => {
     const session = await mongoose.startSession();
     session.startTransaction();

     try {
          const { name, address, card, salesRepId } = payload;
          const retailerId = new mongoose.Types.ObjectId(id);

          // Prepare update object for retailer
          const updateFields: any = {};
          if (name !== undefined) updateFields.name = name;
          if (address !== undefined) updateFields.address = address;

          // Update retailer info
          let retailer = await User.findOneAndUpdate(
               { _id: retailerId, role: USER_ROLES.RETAILER },
               { $set: updateFields },
               { new: true, session },
          ).select('name email address assignedSalesRep');

          if (!retailer) {
               throw new AppError(StatusCodes.NOT_FOUND, 'Retailer not found');
          }

          // Find all sales reps
          const salesReps = await User.find({ role: USER_ROLES.SALES }).session(session);

          // Remove retailerId from all sales reps who have it assigned
          for (const salesRep of salesReps) {
               if (
                    Array.isArray(salesRep?.assignedRetailers) &&
                    salesRep?.assignedRetailers?.some((rId: mongoose.Types.ObjectId) => rId.equals(retailerId))
               ) {
                    await User.findOneAndUpdate({ _id: salesRep._id }, { $pull: { assignedRetailers: retailerId } }, { new: true, session });
               }
          }

          let salesRep = null;

          if (salesRepId) {
               const salesRepObjectId = new mongoose.Types.ObjectId(salesRepId);

               // Add retailerId to the new sales rep
               salesRep = await User.findOneAndUpdate(
                    { _id: salesRepObjectId, role: USER_ROLES.SALES }, // Added role check for safety
                    { $push: { assignedRetailers: retailerId } },
                    { new: true, session },
               );

               if (!salesRep) {
                    throw new AppError(StatusCodes.NOT_FOUND, 'Sales rep not found');
               }

               // Update retailer's assignedSalesRep field
               retailer = await User.findOneAndUpdate({ _id: retailerId }, { assignedSalesRep: salesRep?._id }, { new: true, session });
          } else {
               // If salesRepId is not provided, set assignedSalesRep to null
               retailer = await User.findOneAndUpdate({ _id: retailerId }, { assignedSalesRep: null }, { new: true, session });
          }

          // Update or create subscription purchase card info
          if (card) {
               const subscription = await SubscriptionPurchase.findOne({
                    userId: retailerId,
               }).session(session);

               if (subscription) {
                    await SubscriptionPurchase.findOneAndUpdate({ userId: retailerId }, { card }, { new: true, session });
               } else {
                    await SubscriptionPurchase.create([{ userId: retailerId, card }], {
                         session,
                    });
               }
          }

          await session.commitTransaction();
          session.endSession();

          return retailer;
     } catch (error) {
          await session.abortTransaction();
          session.endSession();
          throw error;
     }
};

const deleteRetailer = async (id: string) => {
     const session = await mongoose.startSession();
     session.startTransaction();

     try {
          const retailerId = new mongoose.Types.ObjectId(id);

          // Find sales reps with this retailer assigned
          const salesReps = await User.find({
               role: USER_ROLES.SALES,
          }).session(session);

          // Process sales reps sequentially to maintain transaction integrity
          if (salesReps && salesReps.length > 0) {
               for (const salesRep of salesReps) {
                    // Fix property name: assignedRetailers -> assignedRetailerss
                    if (
                         Array.isArray(salesRep.assignedRetailers) &&
                         salesRep.assignedRetailers.some((rId: mongoose.Types.ObjectId) => rId.equals(retailerId))
                    ) {
                         await User.findOneAndUpdate({ _id: salesRep._id }, { $pull: { assignedRetailers: retailerId } }, { new: true, session });
                    }
               }
          }

          // Mark retailer as deleted
          const retailer = await User.findOneAndUpdate({ _id: retailerId, role: USER_ROLES.RETAILER }, { isDeleted: true }, { new: true, session });

          if (!retailer) {
               throw new AppError(StatusCodes.NOT_FOUND, 'Retailer not found');
          }

          // Delete associated subscription purchase
          await SubscriptionPurchase.findOneAndDelete({ userId: retailerId }, { session });

          await session.commitTransaction();
          return retailer; // Return the deleted retailer
     } catch (error) {
          await session.abortTransaction();
          throw error;
     } finally {
          session.endSession();
     }
};

export const RetailerService = {
     getAllRetailers,
     getSingleRetailer,
     createRetailer,
     updateRetailer,
     deleteRetailer,
};
