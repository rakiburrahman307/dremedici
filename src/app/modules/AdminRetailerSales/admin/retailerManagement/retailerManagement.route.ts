import express from 'express';
import { RetailerController } from './retailerManagement.controller';
import auth from '../../../../middleware/auth';
import { USER_ROLES } from '../../../../../enums/user';

const router = express.Router();

router.get('/', auth(USER_ROLES.ADMIN), RetailerController.getAllRetailers);
router.get('/:id', auth(USER_ROLES.ADMIN), RetailerController.getSingleRetailer);
router.post('/create', auth(USER_ROLES.ADMIN), RetailerController.createRetailer);
router.patch('/:id', auth(USER_ROLES.ADMIN), RetailerController.updateRetailer);
router.delete('/delete/:id', auth(USER_ROLES.ADMIN), RetailerController.deleteRetailer);

export const RetailerRoutes = router;
