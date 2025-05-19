import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { SubscriptionService } from './subscriptionManagemant.service';

const getAllSubcription = catchAsync(async (req, res) => {
     const result = await SubscriptionService.getAllSubcription(req.query);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Total subcription retrieved successfully',
          data: result.subscription,
          pagination: result.meta,
     });
});
const getAnalysis = catchAsync(async (req, res) => {
     const result = await SubscriptionService.getAnalysis();
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Total retrieved successfully',
          data: result,
     });
});
const getSingleSubcription = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SubscriptionService.getSingleSubcription(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Subcriptionn retrieved successfully',
          data: result,
     });
});
const updateStatus = catchAsync(async (req, res) => {
     const { id } = req.params;
     const { status } = req.body;
     const result = await SubscriptionService.updateSubscriptionStatus(id, status);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Subcriptionn update successfully',
          data: result,
     });
});

export const SubscriptionManageController = {
     getAnalysis,
     getAllSubcription,
     getSingleSubcription,
     updateStatus,
};
