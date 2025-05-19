import mongoose from 'mongoose';
import ISubscriptionPlan from './subscription.interface';

const subscriptionPlanSchema = new mongoose.Schema<ISubscriptionPlan>(
     {
          tier: {
               type: String,
               required: true,
          },
          subscription: {
               type: String,
               default: '',
               required: false,
          },
          freeShipping: {
               type: String,
               required: true,
          },
          noCreditCardFee: {
               type: String,
               required: true,
          },
          exclusiveProducts: {
               type: String,
               required: true,
          },
          limitedReleases: {
               type: String,
               required: true,
          },
          termsAndConditionsAccepted: {
               type: Boolean,
               required: true,
          },
          status: {
               type: String,
               default: 'active',
               enum: ['active', 'inactive'],
          },
     },
     {
          timestamps: true,
     },
);

export const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
