import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLES } from '../../../../../enums/user';
import { CommissionController } from './commission.controller';
const router = express.Router();
router.get('/', auth(USER_ROLES.SALES), CommissionController.getTotalOrdersCommissionEarn);
router.get('/order', auth(USER_ROLES.SALES), CommissionController.getTotalOrdersCommission);
export const CommissionRouter = router;
