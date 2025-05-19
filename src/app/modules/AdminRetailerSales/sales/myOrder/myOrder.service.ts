import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import QueryBuilder from '../../../../builder/QueryBuilder';
import { User } from '../../../user/user.model';
import Order from '../../admin/orderManagement/orderManagement.model';

const getMyOrder = async (userId: string, query: Record<string, unknown>) => {
     const user = await User.findById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }
     const queryBuilder = new QueryBuilder(Order.find({ userId: user.assignedRetailers }).populate('userId', 'name'), query);
     const orders = await queryBuilder.filter().sort().paginate().search(['userId.name', 'orderId']).modelQuery;
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
export const MyOrderService = { getMyOrder, getMyOrderById };
