import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { CommissionService } from './commission.service';

const getTotalOrdersCommissionEarn = catchAsync(async (req, res) => {
     const { id } = req.user;
     const result = await CommissionService.calculateTotalCommission(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Total orders commission retrieved successfully',
          data: result,
     });
});
const getTotalOrdersCommission = catchAsync(async (req, res) => {
     const { id } = req.user;
     const result = await CommissionService.getTotalOrdersCommission(id, req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Total orders retrieved successfully',
          data: result.data,
          pagination: result.meta,
     });
});

export const CommissionController = { getTotalOrdersCommission, getTotalOrdersCommissionEarn };
