import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import QueryBuilder from '../../../../builder/QueryBuilder';
import { Product } from '../../admin/inventoryManagement/inventory.model';
import Order from '../../admin/orderManagement/orderManagement.model';
import mongoose from 'mongoose';
import { SubscriptionPurchase } from '../subscriptionPurchase/subscription.purchase.model';
import { User } from '../../../user/user.model';
import { LoyaltyProgram } from '../../admin/loyalty/loyalty.model';
import { USER_ROLES } from '../../../../../enums/user';
// get all products
const getAllProducts = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(Product.find(), query);
     const products = await queryBuilder.search(['name', 'category']).filter().sort().paginate().fields().modelQuery.exec();

     const meta = await queryBuilder.countTotal();

     return {
          products,
          meta,
     };
};
const cretaeOrderToDb = async (userId: string, payload: any) => {
     const session = await mongoose.startSession();
     session.startTransaction();

     try {
          const subscription = await SubscriptionPurchase.findOne({
               userId: new mongoose.Types.ObjectId(userId),
          }).session(session);
          if (!subscription) {
               throw new AppError(StatusCodes.NOT_FOUND, 'You have not purchased a subscription');
          }
          if (subscription.status !== 'running') {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Your subscription is not running');
          }
          const user = await User.findById(userId);
          if (!user) {
               throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
          }
          payload.userId = new mongoose.Types.ObjectId(userId);

          // Create the order with session
          const order = await Order.create([payload], { session });
          if (!order || order.length === 0) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create order');
          }

          // Bulk update product quantities within the session
          const bulkOperations = payload.products.map((product: { productId: mongoose.Types.ObjectId; quantity: number }) => ({
               updateOne: {
                    filter: { _id: product.productId },
                    update: { $inc: { quantity: -product.quantity } },
               },
          }));

          const updateResult = await Product.bulkWrite(bulkOperations, { session });
          if (!updateResult || updateResult.modifiedCount === 0) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update product quantities');
          }

          // Update loyalty tierNumber with session
          if (user.role !== USER_ROLES.RETAILER) {
               const updatedLoyalty = await LoyaltyProgram.findOneAndUpdate(
                    { userId: new mongoose.Types.ObjectId(userId) },
                    { $inc: { tierNumber: order[0].totalAmount } },
                    { new: true, session },
               );

               if (!updatedLoyalty) {
                    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update tier number');
               }
          }
          await session.commitTransaction();
          session.endSession();

          return order[0];
     } catch (error) {
          await session.abortTransaction();
          session.endSession();
          throw error;
     }
};

const getMyOrders = async (id: string, query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(Order.find({ userId: new mongoose.Types.ObjectId(id) }), query);
     const orders = await queryBuilder.filter().sort().paginate().search(['name', 'orderId']).modelQuery;
     const meta = await queryBuilder.countTotal();
     return {
          orders,
          meta,
     };
};

const getMyOrderById = async (id: string) => {
     const result = await Order.findById(id).populate({
          path: 'products.productId',
          select: 'name',
     });

     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
     }

     return result;
};

const getUserOrderSummary = async (id: string) => {
     const result = await Order.aggregate([
          {
               $match: {
                    userId: new mongoose.Types.ObjectId(id),
               },
          },
          {
               $facet: {
                    totalPurchaseAmount: [
                         {
                              $group: {
                                   _id: null,
                                   totalAmount: {
                                        $sum: '$totalAmount',
                                   },
                              },
                         },
                    ],
                    totalOrderCompleate: [
                         {
                              $match: {
                                   orderStatus: 'delivered',
                              },
                         },
                         {
                              $group: {
                                   _id: null,
                                   totalOrderCompleate: {
                                        $sum: 1,
                                   },
                              },
                         },
                    ],
               },
          },
          {
               $project: {
                    totalPurchaseAmount: {
                         $arrayElemAt: ['$totalPurchaseAmount.totalAmount', 0],
                    },
                    totalOrderCompleate: {
                         $arrayElemAt: ['$totalOrderCompleate.totalOrderCompleate', 0],
                    },
               },
          },
     ]);

     return result[0]
          ? {
                 totalPurchaseAmount: result[0].totalPurchaseAmount || 0,
                 totalOrderCompleate: result[0].totalOrderCompleate || 0,
            }
          : { totalPurchaseAmount: 0, totalOrderCompleate: 0 };
};
const getMyRetailers = async (userId: string) => {
     // Find the user by id
     const user = await User.findById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }

     // assignedRetailers is array of ObjectIds
     const assignedRetailers = user.assignedRetailers || [];

     // If no assigned retailers, return empty result early
     if (assignedRetailers.length === 0) {
          return {
               assignedRetailers: [],
          };
     }

     // Query the assigned retailers directly by their _id
     const myRetailers = await User.find({ _id: { $in: assignedRetailers } });
     if (!myRetailers) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Retailers not found');
     }
     return {
          assignedRetailers: myRetailers,
     };
};
export const RetailerDashboardService = {
     getAllProducts,
     cretaeOrderToDb,
     getMyOrders,
     getMyOrderById,
     getUserOrderSummary,
     getMyRetailers,
};
