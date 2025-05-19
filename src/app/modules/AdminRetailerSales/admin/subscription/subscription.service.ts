import { StatusCodes } from 'http-status-codes';
import AppError from '../../../../../errors/AppError';
import QueryBuilder from '../../../../builder/QueryBuilder';
import { SubscriptionPlan } from './subscription.model';
import ISubscriptionPlan from './subscription.interface';

const getAllSubscriptions = async (query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(SubscriptionPlan.find(), query);

     const result = await queryBuilder.search(['title', 'paymentType', 'credit', 'description']).filter().sort().paginate().fields().modelQuery;
     const meta = await queryBuilder.countTotal();
     return {
          meta,
          result,
     };
};

const getSubscriptionById = async (id: string) => {
     const subscription = await SubscriptionPlan.findById(id);
     if (!subscription) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found');
     }
     return subscription;
};

const createSubscription = async (payload: ISubscriptionPlan): Promise<ISubscriptionPlan> => {
     const subscription = await SubscriptionPlan.create(payload);
     if (!subscription) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create subscription');
     }
     return subscription;
};

const updateSubscription = async (id: string, payload: Partial<ISubscriptionPlan>) => {
     const subscription = await SubscriptionPlan.findByIdAndUpdate(id, payload, {
          new: true,
     });

     if (!subscription) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found');
     }

     return subscription;
};

const deleteSubscription = async (id: string): Promise<ISubscriptionPlan> => {
     const subscription = await SubscriptionPlan.findByIdAndDelete(id);

     if (!subscription) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found');
     }
     return subscription;
};
const updateSubscriptionStatus = async (id: string, status: string) => {
     const subscription = await SubscriptionPlan.findByIdAndUpdate(id, { status }, { new: true });

     if (!subscription) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Subscription not found');
     }

     return subscription;
};
export const SubscriptionService = {
     getAllSubscriptions,
     getSubscriptionById,
     createSubscription,
     updateSubscription,
     deleteSubscription,
     updateSubscriptionStatus,
};
