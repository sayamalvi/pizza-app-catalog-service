import express, { RequestHandler } from 'express';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { ROLES } from '../common/enums';
import { asyncWrapper } from '../common/utils/error-wrapper';
import { ProductController } from './product-controller';
import createProductValidator from './create-product-validator';
import updateProductValidator from './update-product-validator';
import { ProductService } from './product-service';
import fileUpload from 'express-fileupload';
import { S3Storage } from '../common/services/S3Storage';
import createHttpError from 'http-errors';

const router = express.Router();
const productService = new ProductService();
const s3Storage = new S3Storage();

const productController = new ProductController(productService, s3Storage);
router.post(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]) as unknown as RequestHandler,
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            next(createHttpError(400, 'File should be 500kb'));
        },
    }),
    createProductValidator,
    asyncWrapper(productController.create),
);
router.patch(
    '/:productId',
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]) as unknown as RequestHandler,
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            next(createHttpError(400, 'File should be 500kb'));
        },
    }),
    updateProductValidator,
    asyncWrapper(productController.update),
);

export default router;