// import catchAsync from '../../../../../shared/catchAsync';
// import sendResponse from '../../../../../shared/sendResponse';
// import { StatusCodes } from 'http-status-codes';
// import { myOrderService } from './myOrder.service';

// const createOrder = catchAsync(async (req, res) => {
//   const { id }: any = req.user;
//   const result = await myOrderService.createOrder(id,req.body);
//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     success: true,
//     message: 'Order created successfully',
//     data: result,
//   });
// });

// const getAllOrders = catchAsync(async (req, res) => {
//   const result = await myOrderService.getAllOrders(req.query);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Orders retrieved successfully',
//     data: result.orders,
//     pagination: result.meta,
//   });
// });

// const getOrderById = catchAsync(async (req, res) => {
//   const result = await myOrderService.getOrderById(req.params.id);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Order retrieved successfully',
//     data: result,
//   });
// });

// const updateOrder = catchAsync(async (req, res) => {
//   const result = await myOrderService.updateOrder(req.params.id, req.body);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Order updated successfully',
//     data: result,
//   });
// });

// const deleteOrder = catchAsync(async (req, res) => {
//   const result = await myOrderService.deleteOrder(req.params.id);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Order deleted successfully',
//     data: result,
//   });
// });

// export const myOrderController = {
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   updateOrder,
//   deleteOrder,
// };
