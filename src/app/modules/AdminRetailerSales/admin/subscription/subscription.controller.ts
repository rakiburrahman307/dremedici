import { Request, Response } from 'express';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { SubscriptionService } from './subscription.service';

const getAllSubscriptions = catchAsync(async (req, res) => {
     const result = await SubscriptionService.getAllSubscriptions(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Subscriptions retrieved successfully',
          data: result,
     });
});

const getSubscriptionById = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SubscriptionService.getSubscriptionById(id);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Subscription retrieved successfully',
          data: result,
     });
});

const createSubscription = catchAsync(async (req, res) => {
     const result = await SubscriptionService.createSubscription(req.body);

     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Subscription created successfully',
          data: result,
     });
});

const updateSubscription = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SubscriptionService.updateSubscription(id, req.body);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Subscription updated successfully',
          data: result,
     });
});

const deleteSubscription = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SubscriptionService.deleteSubscription(id);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Subscription deleted successfully',
          data: result,
     });
});
const updateSubscriptionStatus = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const { status } = req.body;
     const result = await SubscriptionService.updateSubscriptionStatus(id, status);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Subscription status updated successfully',
          data: result,
     });
});
export const SubscriptionController = {
     getAllSubscriptions,
     getSubscriptionById,
     createSubscription,
     updateSubscription,
     deleteSubscription,
     updateSubscriptionStatus,
};
