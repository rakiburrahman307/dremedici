import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import { User } from '../../../user/user.model';
import Order from '../../admin/orderManagement/orderManagement.model';
import QueryBuilder from '../../../../builder/QueryBuilder';
import mongoose from 'mongoose';
import { Product } from '../../admin/inventoryManagement/inventory.model';
const calculateCommission = async (orderId?: string) => {
     const result = await Order.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
          {
               $addFields: {
                    commissionAmount: { $multiply: ['$totalAmount', { $divide: ['$commission', 100] }] },
               },
          },
          {
               $group: {
                    _id: null,
                    totalCommission: { $sum: '$commissionAmount' },
               },
          },
     ]);

     return result[0]?.totalCommission || 0;
};

const getTotalOrdersCommission = async (userId: string, query: Record<string, unknown>) => {
     const user = await User.findById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }

     if (!Array.isArray(user.assignedRetailers) || user.assignedRetailers.length === 0) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'User has no assigned retailers');
     }

     const queryBuilder = new QueryBuilder(Order.find({ userId: { $in: user.assignedRetailers } }), query);

     const orders = await queryBuilder.filter().search(['orderId']).sort().paginate().fields().modelQuery.exec();
     const meta = await queryBuilder.countTotal();

     const ordersWithCommission = await Promise.all(
          orders.map(async (order) => {
               const totalCommission = await calculateCommission(order._id.toString());
               const plainOrder = order.toObject();
               return {
                    ...order.toObject(),
                    products: plainOrder.products.map((product) => ({
                         ...product,
                         commissionAmount: product.price * 0.1,
                         totalQuentityBaseCommission: product.price * 0.1 * product.quantity, // 10% commission per product
                    })),
                    totalCommission,
               };
          }),
     );

     return {
          data: ordersWithCommission,
          meta,
     };
};

const calculateTotalCommission = async (userId: string) => {
     const user = await User.findById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }

     const result = await Order.aggregate([
          {
               $match: {
                    userId: { $in: user.assignedRetailers },
               },
          },
          {
               $addFields: {
                    commissionAmount: { $multiply: ['$totalAmount', { $divide: ['$commission', 100] }] },
               },
          },
          {
               $group: {
                    _id: null,
                    totalCommission: { $sum: '$commissionAmount' },
               },
          },
     ]);

     return result[0]?.totalCommission || 0;
};
export const CommissionService = { getTotalOrdersCommission, calculateTotalCommission };
