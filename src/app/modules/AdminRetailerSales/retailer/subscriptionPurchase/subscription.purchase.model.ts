import mongoose from 'mongoose';
import { ICard, ISubscriptionPurchase } from './subscription.purchase.interface';

// Card Schema
const cardSchema: mongoose.Schema<ICard> = new mongoose.Schema({
     cardHolderName: {
          type: String,
          required: true,
     },
     cardNumber: {
          type: String,
          required: true,
     },
     expiryDate: {
          type: String,
          required: true,
     },
     cvv: {
          type: String,
          required: true,
     },
     zipCode: {
          type: String,
          required: true,
     },
});

// Subscription Schema
const subscriptionPurchaseSchema = new mongoose.Schema<ISubscriptionPurchase>(
     {
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
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
          billingDate: {
               type: Date,
               default: Date.now,
          },
          card: {
               type: cardSchema,
               required: true,
          },
          status: {
               type: String,
               default: 'running',
               enum: ['running', 'blocked'],
          },
     },
     {
          timestamps: true,
     },
);

// Export Subscription Purchase Model
export const SubscriptionPurchase = mongoose.model<ISubscriptionPurchase>('SubscriptionPurchase', subscriptionPurchaseSchema);
