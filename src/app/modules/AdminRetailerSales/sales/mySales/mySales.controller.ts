import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { MySalesService } from './mySales.service';

const getMySales = catchAsync(async (req, res) => {
     const { id } = req.user;
     const result = await MySalesService.getMySales(id, req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sales retrieved successfully',
          data: result,
     });
});

export const MySalesController = { getMySales };
