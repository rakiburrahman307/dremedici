import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import QueryBuilder from '../../../../builder/QueryBuilder';
import Order from './orderManagement.model';
import { USER_ROLES } from '../../../../../enums/user';
import { User } from '../../../user/user.model';

// get all orders
const getAllOrders = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(Order.find(), query);
     const orders = await queryBuilder
          .search(['orderId', 'userId.name', 'items.product'])
          .filter()
          .sort()
          .paginate()
          .modelQuery.populate('userId', 'name email')
          .exec();
     const meta = await queryBuilder.countTotal();

     return {
          meta,
          orders,
     };
};
//  get single order by id
const getOrderById = async (id: string) => {
     const result = await Order.findById(id)
          .populate({
               path: 'userId',
               select: 'name address',
          })
          .populate({
               path: 'products',
               populate: {
                    path: 'productId',
                    select: 'name images',
               },
          });
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
     }
     return result;
};
// update order status
const updateOrderStatus = async (id: string, payload: string) => {
     const isExist = await Order.findById(id);

     if (!isExist) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
     }

     const result = await Order.findByIdAndUpdate(
          id,
          { $set: { orderStatus: payload } },
          {
               new: true,
          },
     );

     return result;
};
const getOrderAnalysis = async () => {
     const result = await Order.aggregate([
          {
               $group: {
                    _id: null,
                    totalQuantity: { $sum: '$orderBoxs' },
                    totalAmount: { $sum: '$totalAmount' },
               },
          },
          {
               $lookup: {
                    from: 'orders',
                    pipeline: [
                         {
                              $match: { orderStatus: 'pending' },
                         },
                         {
                              $group: {
                                   _id: null,
                                   totalPendingOrder: { $sum: 1 },
                              },
                         },
                    ],
                    as: 'pendingOrders',
               },
          },
          {
               $project: {
                    totalQuantity: 1,
                    totalAmount: 1,
                    totalPendingOrder: {
                         $arrayElemAt: ['$pendingOrders.totalPendingOrder', 0],
                    },
               },
          },
     ]);

     return result[0];
};
const getTopPerformerSalesRep = async () => {
     const topPerformingSalesReps = await User.aggregate([
          { $match: { role: USER_ROLES.SALES } },
          {
               $lookup: {
                    from: 'orders', // your order collection name
                    let: { assignedRetailers: '$assignedRetailers' },
                    pipeline: [
                         { $match: { $expr: { $in: ['$userId', '$$assignedRetailers'] } } },
                         { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
                    ],
                    as: 'salesData',
               },
          },
          {
               $addFields: {
                    totalSales: { $ifNull: [{ $arrayElemAt: ['$salesData.totalSales', 0] }, 0] },
               },
          },
          { $sort: { totalSales: -1 } },
          { $limit: 3 },
          {
               $project: {
                    name: 1,
                    email: 1,
                    totalSales: 1,
                    assignedRetailers: 1,
                    image: 1,
               },
          },
     ]);

     return topPerformingSalesReps;
};
const getTopPerformerRetailer = async () => {
     const topRetailers = await Order.aggregate([
          {
               $group: {
                    _id: '$userId',
                    totalSales: { $sum: '$totalAmount' },
               },
          },
          {
               $sort: { totalSales: -1 },
          },
          {
               $limit: 10,
          },
          {
               // Lookup retailer user info
               $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'retailerInfo',
               },
          },
          {
               $unwind: '$retailerInfo',
          },
          {
               // Only include users with role RETAILER
               $match: { 'retailerInfo.role': USER_ROLES.RETAILER },
          },
          {
               // Limit final to top 3 after filtering
               $limit: 3,
          },
          {
               // Project the fields you want
               $project: {
                    'totalSales': 1,
                    'retailerInfo.name': 1,
                    'retailerInfo.email': 1,
                    'retailerInfo.image': 1,
               },
          },
     ]);

     return topRetailers;
};

export const OrderService = {
     getAllOrders,
     getOrderById,
     updateOrderStatus,
     getOrderAnalysis,
     getTopPerformerSalesRep,
     getTopPerformerRetailer,
};
