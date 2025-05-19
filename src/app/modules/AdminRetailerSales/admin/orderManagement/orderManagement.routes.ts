import express from 'express';
import { OrderController } from './orderManagement.controller';
import { OrderValidation } from './orderManagement.validation';
import { USER_ROLES } from '../../../../../enums/user';
import validateRequest from '../../../../middleware/validateRequest';
import auth from '../../../../middleware/auth';

const router = express.Router();

router.get('/analysis', auth(USER_ROLES.ADMIN), OrderController.getOrderAnalysis);
router.get('/top-sales', auth(USER_ROLES.ADMIN), OrderController.getTopPerformerSales);
router.get('/top-retailer', auth(USER_ROLES.ADMIN), OrderController.getTopPerformerRetailer);
router.get('/', auth(USER_ROLES.ADMIN), OrderController.getAllOrders);

router.get('/:id', auth(USER_ROLES.ADMIN), OrderController.getOrderById);

router.patch('/:id', auth(USER_ROLES.ADMIN), validateRequest(OrderValidation.updateOrderZodSchema), OrderController.updateOrder);

export const OrderRoutes = router;
