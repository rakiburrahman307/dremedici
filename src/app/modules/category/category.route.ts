import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import parseFileData from '../../middleware/parseFileData';
const router = express.Router();

router.post(
     '/create',
     auth(USER_ROLES.ADMIN),
     fileUploadHandler(),
     parseFileData('image'),
     validateRequest(CategoryValidation.createCategoryZodSchema),
     CategoryController.createCategory,
);
router.get('/', auth(USER_ROLES.ADMIN), CategoryController.getCategories);
router
     .route('/:id')
     .patch(auth(USER_ROLES.ADMIN), fileUploadHandler(), parseFileData('image'), CategoryController.updateCategory)
     .delete(auth(USER_ROLES.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
