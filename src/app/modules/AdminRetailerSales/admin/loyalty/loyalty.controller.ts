import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { LoyaltyService } from './loyalty.service';

const getReward = catchAsync(async (req, res) => {
     const result = await LoyaltyService.getRewards(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Reward retrieved successfully',
          data: result,
     });
});
const createReward = catchAsync(async (req, res) => {
     const result = await LoyaltyService.createReward(req.body);
     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Reward created successfully',
          data: result,
     });
});
const deleteReward = catchAsync(async (req, res) => {
     const result = await LoyaltyService.deleteReward(req.params.id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Reward delete successfully',
          data: result,
     });
});
const getLoyaltyInfo = catchAsync(async (req, res) => {
     const { id } = req.user;
     const loyalty = await LoyaltyService.getUserLoyaltyInfo(id);
     const availableRewards = await LoyaltyService.getAvailableRewards(loyalty.membershipTier);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Loyalty retrieved successfully',
          data: {
               loyalty,
               availableRewards,
          },
     });
});
const redeemReward = catchAsync(async (req, res) => {
     const { id } = req.user;
     const { rewardId } = req.params;
     const loyalty = await LoyaltyService.redeemReward(id, rewardId);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Reward redeem successfully',
          data: loyalty,
     });
});
const getRewardUser = catchAsync(async (req, res) => {
     const loyalty = await LoyaltyService.getRewardUser(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Reward retrieved successfully',
          data: loyalty,
     });
});
export const LoyaltyController = {
     getLoyaltyInfo,
     redeemReward,
     createReward,
     deleteReward,
     getReward,
     getRewardUser,
};
