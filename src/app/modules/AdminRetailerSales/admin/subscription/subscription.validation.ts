import { z } from 'zod';

const subscriptionPlanValidationSchema = z.object({
     body: z.object({
          tier: z.string().min(1, 'Tier is required'),
          subscription: z.string().min(1, 'Subscription is required').optional(),
          freeShipping: z.string().min(1, 'Free shipping is required'),
          noCreditCardFee: z.string().min(1, 'No credit card fee is required'),
          exclusiveProducts: z.string().min(1, 'Exclusive products are required'),
          limitedReleases: z.string().min(1, 'Limited releases are required'),
          termsAndConditionsAccepted: z.boolean().refine((val) => val === true, 'Terms and conditions must be accepted'),
     }),
});
const subscriptionPlanUpdateValidationSchema = z.object({
     body: z.object({
          tier: z.string().min(1, 'Tier is required'),
          subscription: z.string().min(1, 'Subscription is required').optional(),
          freeShipping: z.string().min(1, 'Free shipping is required'),
          noCreditCardFee: z.string().min(1, 'No credit card fee is required'),
          exclusiveProducts: z.string().min(1, 'Exclusive products are required'),
          limitedReleases: z.string().min(1, 'Limited releases are required'),
          termsAndConditionsAccepted: z.boolean().refine((val) => val === true, 'Terms and conditions must be accepted'),
     }),
});

export const SubscriptionValidation = {
     subscriptionPlanValidationSchema,
     subscriptionPlanUpdateValidationSchema,
};
