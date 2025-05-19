import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import QueryBuilder from '../../../../builder/QueryBuilder';
import { SubscriptionPurchase } from '../../retailer/subscriptionPurchase/subscription.purchase.model';

const getAllSubcription = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(SubscriptionPurchase.find({}).populate('userId', 'name email role'), query);

     const subscription = await queryBuilder.filter().sort().paginate().search(['subscription, userId.name']).modelQuery.exec();

     const meta = await queryBuilder.countTotal();
     return {
          meta,
          subscription,
     };
};

const getSingleSubcription = async (id: string) => {
     const result = await SubscriptionPurchase.findById(id).populate('userId', 'name email role');
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found');
     }
     return result;
};

const getAnalysis = async () => {
     const result = await SubscriptionPurchase.countDocuments();
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found');
     }
     return result;
};
const updateSubscriptionStatus = async (id: string, payload: string) => {
     const result = await SubscriptionPurchase.findByIdAndUpdate(
          id,
          {
               $set: {
                    status: payload,
               },
          },
          {
               new: true,
          },
     );
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found');
     }
     return result;
};
export const SubscriptionService = {
     getAllSubcription,
     getSingleSubcription,
     getAnalysis,
     updateSubscriptionStatus,
};
