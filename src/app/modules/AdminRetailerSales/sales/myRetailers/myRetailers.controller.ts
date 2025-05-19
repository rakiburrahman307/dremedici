import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { MyRetailersService } from './myRetailers.service';

const getMyRetailers = catchAsync(async (req, res) => {
     const { id }: any = req.user;
     const result = await MyRetailersService.getMyRetailers(id, req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'My retailers retrieved successfully',
          data: result.assignedRetailers,
          pagination: result.meta,
     });
});
const getMySingleRetailers = catchAsync(async (req, res) => {
     const { id }: any = req.params;
     const result = await MyRetailersService.getSingleRetailer(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'My retailers retrieved successfully',
          data: result,
     });
});
const getMyRetailersAnalysis = catchAsync(async (req, res) => {
     const { id }: any = req.params;
     const result = await MyRetailersService.getAnalysis(id);
     console.log(result);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Analysis retrieved successfully',
          data: result,
     });
});
const getMyRetailersOrders = catchAsync(async (req, res) => {
     const { id }: any = req.params;
     const result = await MyRetailersService.getOrders(id, req.query);
     console.log(result);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Orders retrieved successfully',
          data: result,
     });
});
const getMyRetailerSingleOrder = catchAsync(async (req, res) => {
     const { id }: any = req.params;
     const result = await MyRetailersService.getSingleOrder(id);
     console.log(result);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Order retrieved successfully',
          data: result,
     });
});
const getMyRetailerInfo = catchAsync(async (req, res) => {
     const { id }: any = req.params;
     const result = await MyRetailersService.getRetailerInfo(id);
     console.log(result);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailer retrieved successfully',
          data: result,
     });
});
const updateMyRetailerInfo = catchAsync(async (req, res) => {
     const { id }: any = req.params;
     const result = await MyRetailersService.updateRetailerInfo(id, req.body);
     console.log(result);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Retailer updated successfully',
          data: result,
     });
});
export const MyOrderController = {
     getMyRetailers,
     getMySingleRetailers,
     getMyRetailersAnalysis,
     getMyRetailersOrders,
     getMyRetailerSingleOrder,
     getMyRetailerInfo,
     updateMyRetailerInfo,
};
