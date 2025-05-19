import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLES } from '../../../../../enums/user';
import { DashboardController } from './dashboard.controller';
const router = express.Router();

router.get('/revenue', auth(USER_ROLES.ADMIN), DashboardController.getRevenue);
router.get('/analysis', auth(USER_ROLES.ADMIN), DashboardController.getAnalysis);
router.get('/top-sales', auth(USER_ROLES.ADMIN), DashboardController.getTopPerformerSales);
router.get('/orders', auth(USER_ROLES.ADMIN), DashboardController.getAllOrders);
export const DashboardRoutes = router;
