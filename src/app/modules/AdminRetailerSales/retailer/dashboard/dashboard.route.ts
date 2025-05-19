import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLES } from '../../../../../enums/user';
import { RetailerDashboardController } from './dashboard.controller';
const router = express.Router();

router.get('/get-products', auth(USER_ROLES.RETAILER, USER_ROLES.SALES), RetailerDashboardController.getTotalProduct);
router.post('/create', auth(USER_ROLES.RETAILER, USER_ROLES.SALES), RetailerDashboardController.cretaeOrder);
router.get('/orders', auth(USER_ROLES.RETAILER, USER_ROLES.SALES), RetailerDashboardController.getMyOrders);
router.get('/orders/:id', auth(USER_ROLES.RETAILER, USER_ROLES.SALES), RetailerDashboardController.getMySingleOrder);
router.get('/summary', auth(USER_ROLES.RETAILER, USER_ROLES.SALES), RetailerDashboardController.getRetailerSummary);
router.get('/my-retailers', auth(USER_ROLES.SALES), RetailerDashboardController.getMyRetailer);
export const RetailerDashboardRoutes = router;
