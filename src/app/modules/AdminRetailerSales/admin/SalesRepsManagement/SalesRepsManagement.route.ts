import express from 'express';
import { USER_ROLES } from '../../../../../enums/user';
import auth from '../../../../middleware/auth';
import { SalesRepsManagementController } from './SalesRepsManagement.controller';

const router = express.Router();

router.get('/', auth(USER_ROLES.ADMIN), SalesRepsManagementController.getSalesRep);
router.get('/unaproved', auth(USER_ROLES.ADMIN), SalesRepsManagementController.getUnaprovedSalesRep);
router.get('/details/analysis/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.salesRepAnalysis);
router.get('/details/retailer/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.salesRepRetailers);
router.get('/details/commission/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.salesRepCommission);
router.get('/unassign/retailer', auth(USER_ROLES.ADMIN), SalesRepsManagementController.getUnassignRetailer);
router.get('/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.getSalesRepById);

router.patch('/aproved/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.aprovedSalesRepByAdmin);
router.post('/create', auth(USER_ROLES.ADMIN), SalesRepsManagementController.addSalesRepByAdmin);
router.post('/details/create-retailer/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.addRetailerToSalesRep);
router.get('/details/retailer/single/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.getRetailerToSalesRep);
router.post('/details/retailer/remove/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.removeRetailerFromSales);
router.delete('/delete/sales/:id', auth(USER_ROLES.ADMIN), SalesRepsManagementController.deleteSaleasRep);
export const SalesRepsManagementRouter = router;
