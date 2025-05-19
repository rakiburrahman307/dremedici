import express from 'express';
import { USER_ROLES } from '../../../../../enums/user';
import { SubscriptionPurchaseController } from './subscription.purchase.controller';
import auth from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validateRequest';
import { SubscriptionPurchaseValidation } from './subscription.purchase.validation';

const router = express.Router();

// Create subscription
router.post(
     '/',
     auth(USER_ROLES.RETAILER),
     validateRequest(SubscriptionPurchaseValidation.subscriptionPurchaseSchema),
     SubscriptionPurchaseController.purchessSubscription,
);
// get current subscription
router.get('/current', auth(USER_ROLES.RETAILER), SubscriptionPurchaseController.getCurrentSubscription);
// Get all subscriptions
router.get('/', auth(USER_ROLES.RETAILER), SubscriptionPurchaseController.getAllSubscriptions);

export const SubscriptionPurchaseRoutes = router;
