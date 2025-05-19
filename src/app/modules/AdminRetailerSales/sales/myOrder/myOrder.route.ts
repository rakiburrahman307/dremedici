import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLES } from '../../../../../enums/user';
import { MyOrderSalesController } from './myOrder.controller';
const router = express.Router();
router.get('/my-order', auth(USER_ROLES.SALES), MyOrderSalesController.getMyOrder);
router.get('/my-order/:id', auth(USER_ROLES.SALES), MyOrderSalesController.getMyOrderById);

export const MySalesOrderRoutes = router;
