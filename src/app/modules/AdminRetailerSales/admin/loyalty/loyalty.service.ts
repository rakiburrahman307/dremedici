import { Types } from 'mongoose';
import { LoyaltyProgram, Reward } from './loyalty.model';
import AppError from '../../../../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { IReward } from './loyalty.interface';
import QueryBuilder from '../../../../builder/QueryBuilder';

const getUserLoyaltyInfo = async (userId: string) => {
     const loyalty = await LoyaltyProgram.findOne({ userId }).populate('rewardsRedeemed');

     if (!loyalty) {
          // If no loyalty info, create default Silver tier for new user
          const newLoyalty = await LoyaltyProgram.create({ userId });
          return newLoyalty;
     }

     return loyalty;
};

const getAvailableRewards = async (tier: string) => {
     // {
     //   tier: {
     //     $in: ['Silver', 'Gold', 'Platinum'].filter((t) => {
     //       // Only tiers equal or below user tier
     //       const tiers = ['Silver', 'Gold', 'Platinum'];
     //       return tiers.indexOf(t) <= tiers.indexOf(tier);
     //     }),
     //   },
     //   isActive: true,
     // }
     return Reward.find();
};

export const redeemReward = async (userId: string, rewardId: string) => {
     const loyalty = await LoyaltyProgram.findOne({ userId });

     if (!loyalty) throw new AppError(StatusCodes.NOT_FOUND, 'Loyalty program not found');

     if (loyalty.rewardsRedeemed.some((reward) => reward.toString() === rewardId)) {
          throw new AppError(StatusCodes.CONFLICT, 'Reward already redeemed');
     }

     loyalty.rewardsRedeemed.push(rewardId as any);
     await loyalty.save();

     return loyalty;
};
export const createReward = async (rewardData: Partial<IReward>) => {
     const result = await Reward.create(rewardData);
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create reward');
     }
     return result;
};
const deleteReward = async (id: string) => {
     const result = await Reward.findByIdAndUpdate(id, {
          isDeleted: true,
     });
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Reward not found');
     }
     return result;
};
const getRewards = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(Reward.find(), {});

     const reward = await queryBuilder.filter().sort().paginate().fields().modelQuery.exec();

     const meta = await queryBuilder.countTotal();
     return {
          meta,
          reward,
     };
};
const getRewardUser = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(LoyaltyProgram.find({}).populate('userId', 'name email'), query);
     const reward = await queryBuilder.filter().sort().paginate().fields().modelQuery.exec();
     const meta = await queryBuilder.countTotal();
     return {
          meta,
          reward,
     };
};
export const LoyaltyService = {
     getUserLoyaltyInfo,
     getAvailableRewards,
     redeemReward,
     createReward,
     deleteReward,
     getRewards,
     getRewardUser,
};
