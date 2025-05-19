import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { RetailerDashboardService } from './dashboard.service';

// const getTotalRevenue = catchAsync(async (req, res) => {
//   const result = await RetailerDashboardService.getTotalRevenue();
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Total revenue retrieved successfully',
//     data: result,
//   });
// });

const getTotalProduct = catchAsync(async (req, res) => {
     const result = await RetailerDashboardService.getAllProducts(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Total product retrieved successfully',
          data: result.products,
          pagination: result.meta,
     });
});
const cretaeOrder = catchAsync(async (req, res) => {
     const { id } = req.user;
     const userId = req.body.userId ? req.body.userId : id;
     const result = await RetailerDashboardService.cretaeOrderToDb(userId, req.body);
     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Order created successfully',
          data: result,
     });
});
const getRetailerSummary = catchAsync(async (req, res) => {
     const { id }: any = req.user;
     const result = await RetailerDashboardService.getUserOrderSummary(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Total order retrieved successfully',
          data: result,
     });
});
const getMyOrders = catchAsync(async (req, res) => {
     const { id } = req.user;
     const result = await RetailerDashboardService.getMyOrders(id, req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'My orders retrieved successfully',
          data: result.orders,
          pagination: result.meta,
     });
});
const getMySingleOrder = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await RetailerDashboardService.getMyOrderById(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order retrieved successfully',
          data: result,
     });
});
const getMyRetailer = catchAsync(async (req, res) => {
     const { id } = req.user;
     const result = await RetailerDashboardService.getMyRetailers(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailer retrieved successfully',
          data: result,
     });
});

export const RetailerDashboardController = {
     getTotalProduct,
     cretaeOrder,
     getMyOrders,
     getMySingleOrder,
     getRetailerSummary,
     getMyRetailer,
};
