import express from 'express';
import { USER_ROLES } from '../../../../../enums/user';
import { ProductValidation } from './inventory.validation';
import { ProductController } from './inventory.controller';
import validateRequest from '../../../../middleware/validateRequest';
import auth from '../../../../middleware/auth';
import fileUploadHandler from '../../../../middleware/fileUploadHandler';
import parseMultipleFiledata from '../../../../middleware/parseMultipleFiledata';

const router = express.Router();

router.post(
     '/create',
     auth(USER_ROLES.ADMIN),
     fileUploadHandler(),
     parseMultipleFiledata,
     validateRequest(ProductValidation.createProductZodSchema),
     ProductController.createProduct,
);

router.get('/analysis', auth(USER_ROLES.ADMIN), ProductController.getProductTotalAnalysis);
router.get('/', auth(USER_ROLES.ADMIN), ProductController.getAllProduct);

router.get('/:id', auth(USER_ROLES.ADMIN), ProductController.getSingleProduct);

router.patch(
     '/:id',
     auth(USER_ROLES.ADMIN),
     fileUploadHandler(),
     parseMultipleFiledata,
     validateRequest(ProductValidation.updateProductZodSchema),
     ProductController.updateProduct,
);
router.patch(
     '/update-quantity/:id',
     auth(USER_ROLES.ADMIN),
     validateRequest(ProductValidation.updateProductQuantityZodSchema),
     ProductController.updateProductQuantity,
);

router.delete('/:id', auth(USER_ROLES.ADMIN), ProductController.deleteProduct);
export const ProductsRoutes = router;
