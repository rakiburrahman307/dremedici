import express from 'express';
import { USER_ROLES } from '../../../../../enums/user';
import auth from '../../../../middleware/auth';
import { SubscriptionManageController } from './subscriptionManagemant.controller';
const router = express.Router();

router.get('/get-subcription', auth(USER_ROLES.ADMIN), SubscriptionManageController.getAllSubcription);
router.get('/analysis', auth(USER_ROLES.ADMIN), SubscriptionManageController.getAnalysis);
router.put('/update/:id', auth(USER_ROLES.ADMIN), SubscriptionManageController.updateStatus);
router.get('/get-subcription/:id', auth(USER_ROLES.ADMIN), SubscriptionManageController.getSingleSubcription);
export const SubscriptionManageRouter = router;
