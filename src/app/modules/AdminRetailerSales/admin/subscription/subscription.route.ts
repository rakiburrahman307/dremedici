import express from 'express';
import { USER_ROLES } from '../../../../../enums/user';
import { SubscriptionController } from './subscription.controller';
import validateRequest from '../../../../middleware/validateRequest';
import auth from '../../../../middleware/auth';
import { SubscriptionValidation } from './subscription.validation';

const router = express.Router();

router.get('/', auth(USER_ROLES.ADMIN), SubscriptionController.getAllSubscriptions);

router.get('/:id', auth(USER_ROLES.ADMIN), SubscriptionController.getSubscriptionById);

router.post(
     '/',
     auth(USER_ROLES.ADMIN),
     validateRequest(SubscriptionValidation.subscriptionPlanValidationSchema),
     SubscriptionController.createSubscription,
);

router.patch(
     '/:id',
     auth(USER_ROLES.ADMIN),
     validateRequest(SubscriptionValidation.subscriptionPlanUpdateValidationSchema),
     SubscriptionController.updateSubscription,
);
router.patch('/status/:id', auth(USER_ROLES.ADMIN), SubscriptionController.updateSubscriptionStatus);
router.delete('/:id', auth(USER_ROLES.ADMIN), SubscriptionController.deleteSubscription);

export const SubscriptionRoutes = router;
