import express, { RequestHandler } from 'express';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { ROLES } from '../common/enums';
import { asyncWrapper } from '../common/utils/error-wrapper';
import { ProductController } from './product-controller';
import productValidator from './product-validator';

const router = express.Router();
const productController = new ProductController();
router.post(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]) as unknown as RequestHandler,
    productValidator,
    asyncWrapper(productController.create),
);
export default router;
