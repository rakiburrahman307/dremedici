import express from 'express';
import { LoyaltyController } from './loyalty.controller';
import auth from '../../../../middleware/auth';
import { USER_ROLES } from '../../../../../enums/user';

const router = express.Router();

router.get('/loyalty/reward', auth(USER_ROLES.ADMIN), LoyaltyController.getReward);
router.post('/loyalty/reward/create', auth(USER_ROLES.ADMIN), LoyaltyController.createReward);
router.delete('/loyalty/reward/delete/:id', auth(USER_ROLES.ADMIN), LoyaltyController.deleteReward);
router.get('/loyalty/get', auth(USER_ROLES.ADMIN), LoyaltyController.getRewardUser);
router.get('/loyalty', auth(USER_ROLES.RETAILER), LoyaltyController.getLoyaltyInfo);
router.post('/redeem/:rewardId', auth(USER_ROLES.RETAILER), LoyaltyController.redeemReward);

export const LoyaltyRouter = router;
