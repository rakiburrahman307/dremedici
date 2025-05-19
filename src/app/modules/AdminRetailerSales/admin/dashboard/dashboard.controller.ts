import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { DashboardSearvice } from './dashboard.service';

const getAnalysis = catchAsync(async (req, res) => {
     const result = await DashboardSearvice.getTotalAnalysis();
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Analysis retrieved successfully',
          data: result,
     });
});
const getRevenue = catchAsync(async (req, res) => {
     const result = await DashboardSearvice.getMonthlyRevenueAllMonths();
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Revenue retrieved successfully',
          data: result,
     });
});
const getAllOrders = catchAsync(async (req, res) => {
     const result = await DashboardSearvice.getAllOrders(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Orders retrieved successfully',
          data: result,
     });
});
const getTopPerformerSales = catchAsync(async (req, res) => {
     const result = await DashboardSearvice.getTopPerformerSalesRep(req.query);
     const meta = {
          page: Number(req.query.page),
          limit: Number(req.query.limit),
          total: result.total,
          totalPage: result.totalPages,
     };
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Top performer retrieved successfully',
          data: result.data,
          pagination: meta,
     });
});

export const DashboardController = { getTopPerformerSales, getAnalysis, getAllOrders, getRevenue };
