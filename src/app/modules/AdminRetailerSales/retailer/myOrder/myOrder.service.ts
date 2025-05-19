// import { StatusCodes } from 'http-status-codes';
// import { IOrder } from '../../admin/orderManagement/orderManagement.interface';
// import AppError from '../../../../../errors/AppError';
// import Order from '../../admin/orderManagement/orderManagement.model';

// const createOrder = async (id: string, payload: IOrder) => {

//   const result = await Order.create(payload);
//   if (!result) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create order');
//   }
//   return result;
// };

// const getAllOrders = async (filters: any): Promise<IGenericResponse<any>> => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(
//     filters as IPaginationOptions,
//   );

//   const result = await prisma.order.findMany({
//     where: {
//       retailerId: filters.retailerId,
//     },
//     skip,
//     take: limit,
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   const total = await prisma.order.count({
//     where: {
//       retailerId: filters.retailerId,
//     },
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     orders: result,
//   };
// };

// const getOrderById = async (id: string) => {
//   const result = await prisma.order.findUnique({
//     where: {
//       id,
//     },
//   });
//   return result;
// };

// const updateOrder = async (id: string, payload: any) => {
//   const result = await prisma.order.update({
//     where: {
//       id,
//     },
//     data: payload,
//   });
//   return result;
// };

// const deleteOrder = async (id: string) => {
//   const result = await prisma.order.delete({
//     where: {
//       id,
//     },
//   });
//   return result;
// };

// export const myOrderService = {
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   updateOrder,
//   deleteOrder,
// };
