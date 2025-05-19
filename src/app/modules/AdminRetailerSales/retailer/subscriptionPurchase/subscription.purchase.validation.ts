import { z } from 'zod';
import mongoose from 'mongoose';

// Card schema
const cardSchema = z.object({
     cardHolderName: z.string().min(1, 'Card holder name is required'),
     cardNumber: z.string().min(12).max(19).regex(/^\d+$/, 'Card number must be digits only'), // basic validation
     expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry date must be in MM/YY format'),
     cvv: z.string().min(3).max(4).regex(/^\d+$/, 'CVV must be digits only'),
     zipCode: z.string().min(3).max(10),
});

// Subscription purchase schema
const subscriptionPurchaseSchema = z.object({
     body: z.object({
          tier: z.string().min(1),
          subscription: z.string().min(1),
          freeShipping: z.string().min(1),
          noCreditCardFee: z.string().min(1),
          exclusiveProducts: z.string().min(1),
          limitedReleases: z.string().min(1),
          card: cardSchema,
          termsAndConditionsAccepted: z.boolean(),
     }),
});

export const SubscriptionPurchaseValidation = { subscriptionPurchaseSchema };
