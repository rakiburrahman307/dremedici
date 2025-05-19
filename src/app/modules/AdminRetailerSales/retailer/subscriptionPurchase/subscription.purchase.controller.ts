import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { SubscriptionPurchaseService } from './subscription.purchase.service';

const purchessSubscription = catchAsync(async (req, res) => {
     const { ...subscriptionData } = req.body;
     const { id } = req.user;
     const result = await SubscriptionPurchaseService.subscriptionPurchase(id, subscriptionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Subscription purchess successfully',
          data: result,
     });
});
const getAllSubscriptions = catchAsync(async (req, res) => {
     const result = await SubscriptionPurchaseService.getAllSubscriptionsPackage();
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Subscriptions retrieved successfully',
          data: result,
     });
});
const getCurrentSubscription = catchAsync(async (req, res) => {
     const { id } = req.user;
     const result = await SubscriptionPurchaseService.getCurrentSubscription(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Subscription retrieved successfully',
          data: result,
     });
});
export const SubscriptionPurchaseController = {
     purchessSubscription,
     getAllSubscriptions,
     getCurrentSubscription,
};
