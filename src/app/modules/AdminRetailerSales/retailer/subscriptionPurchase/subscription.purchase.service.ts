import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import { SubscriptionPurchase } from './subscription.purchase.model';
import { SubscriptionPlan } from '../../admin/subscription/subscription.model';
import { User } from '../../../user/user.model';
import { LoyaltyProgram } from '../../admin/loyalty/loyalty.model';

const subscriptionPurchase = async (userId: string, payload: any) => {
     payload.userId = userId;
     const existingSubscription = await SubscriptionPurchase.findOne({
          userId,
     });
     const isExistLoyalty = await LoyaltyProgram.findOne({
          userId,
     });
     if (!isExistLoyalty) {
          await LoyaltyProgram.create({
               userId,
          });
     }
     if (existingSubscription) {
          const updatedSubscription = await SubscriptionPurchase.findOneAndUpdate({ userId }, payload, {
               new: true,
          });
          await LoyaltyProgram.findOneAndUpdate(
               { userId },
               {
                    $set: {
                         membershipTier: payload.tier,
                    },
               },
               { new: true },
          );
          if (!updatedSubscription) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update subscription');
          }
          return updatedSubscription;
     }
     const subscription = await SubscriptionPurchase.create(payload);
     if (!subscription) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to purchase subscription');
     }
     return subscription;
};
const getAllSubscriptionsPackage = async () => {
     const subscription = await SubscriptionPlan.find({ status: 'active' });
     if (!subscription) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'No subscription found for this user');
     }
     return subscription;
};
const getCurrentSubscription = async (userId: string) => {
     const subscription = await SubscriptionPurchase.findOne({ userId });
     if (!subscription) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'No subscription found for this user');
     }
     return subscription;
};
export const SubscriptionPurchaseService = {
     subscriptionPurchase,
     getCurrentSubscription,
     getAllSubscriptionsPackage,
};
