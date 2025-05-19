import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLES } from '../../../../../enums/user';
import { MyOrderController } from './myRetailers.controller';

const router = express.Router();

router.get('/my-retailers', auth(USER_ROLES.SALES), MyOrderController.getMyRetailers);
router.get('/my-retailer/details/analysis/:id', auth(USER_ROLES.SALES), MyOrderController.getMyRetailersAnalysis);
router.get('/my-retailer/details/orders/:id', auth(USER_ROLES.SALES), MyOrderController.getMyRetailersOrders);
router.get('/my-retailer/details/order/:id', auth(USER_ROLES.SALES), MyOrderController.getMyRetailerSingleOrder);
router.get('/my-retailer/details/:id', auth(USER_ROLES.SALES), MyOrderController.getMyRetailerInfo);

router.get('/my-retailer/:id', auth(USER_ROLES.SALES), MyOrderController.getMySingleRetailers);
router.patch('/my-retailer/update/:id', auth(USER_ROLES.SALES), MyOrderController.updateMyRetailerInfo);
export const SalesRoutes = router;
