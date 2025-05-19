import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLES } from '../../../../../enums/user';
import { MySalesController } from './mySales.controller';
const router = express.Router();
router.get('/my-sales', auth(USER_ROLES.SALES), MySalesController.getMySales);
export const MySalesRoutes = router;
