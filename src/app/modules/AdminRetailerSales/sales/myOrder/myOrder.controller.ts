import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { MyOrderService } from './myOrder.service';

const getMyOrder = catchAsync(async (req, res) => {
     const { id } = req.user;
     const result = await MyOrderService.getMyOrder(id, req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order retrieved successfully',
          data: result.orders,
          pagination: result.meta,
     });
});
const getMyOrderById = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await MyOrderService.getMyOrderById(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order retrieved successfully',
          data: result,
     });
});
export const MyOrderSalesController = { getMyOrder, getMyOrderById };
