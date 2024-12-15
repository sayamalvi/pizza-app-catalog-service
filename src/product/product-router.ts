import express, { RequestHandler } from 'express';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { ROLES } from '../common/enums';
import { asyncWrapper } from '../common/utils/error-wrapper';
import { ProductController } from './product-controller';
import productValidator from './product-validator';
import { ProductService } from './product-service';
import fileUpload from 'express-fileupload';

const router = express.Router();
const productService = new ProductService();
const productController = new ProductController(productService);
router.post(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]) as unknown as RequestHandler,
    fileUpload(),
    productValidator,
    asyncWrapper(productController.create),
);
export default router;
