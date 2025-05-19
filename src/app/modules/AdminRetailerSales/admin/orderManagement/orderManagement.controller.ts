import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { OrderService } from './orderManagement.service';

// get all orders
const getAllOrders = catchAsync(async (req, res) => {
     const result = await OrderService.getAllOrders(req.query);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Orders retrieved successfully',
          data: result.orders,
          pagination: result.meta,
     });
});
// get order by id
const getOrderById = catchAsync(async (req, res) => {
     const result = await OrderService.getOrderById(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order retrieved successfully',
          data: result,
     });
});
//  update order status
const updateOrder = catchAsync(async (req, res) => {
     const { orderStatus } = req.body;
     const result = await OrderService.updateOrderStatus(req.params.id, orderStatus);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order status updated successfully',
          data: result,
     });
});
const getOrderAnalysis = catchAsync(async (req, res) => {
     const result = await OrderService.getOrderAnalysis();
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order status updated successfully',
          data: result,
     });
});
const getTopPerformerSales = catchAsync(async (req, res) => {
     const result = await OrderService.getTopPerformerSalesRep();
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Top performer retrieved successfully',
          data: result,
     });
});
const getTopPerformerRetailer = catchAsync(async (req, res) => {
     const result = await OrderService.getTopPerformerRetailer();
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Top performer retrieved successfully',
          data: result,
     });
});

export const OrderController = {
     getAllOrders,
     getOrderById,
     updateOrder,
     getOrderAnalysis,
     getTopPerformerSales,
     getTopPerformerRetailer,
};
