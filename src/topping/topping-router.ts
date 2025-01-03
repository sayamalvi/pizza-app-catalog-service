import express from 'express';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { ROLES } from '../common/enums';
import fileUpload from 'express-fileupload';
import createHttpError from 'http-errors';
import { asyncWrapper } from '../common/utils/error-wrapper';
import createToppingValidator from './validators/create-topping-validator';
import { ToppingController } from './topping-controller';
import { ToppingService } from './topping-service';
import { S3Storage } from '../common/services/S3Storage';

const router = express.Router();

const toppingService = new ToppingService();
const toppingController = new ToppingController(
    new S3Storage(),
    toppingService,
);

router.post(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN, ROLES.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, 'File size exceeds the limit');
            next(error);
        },
    }),
    createToppingValidator,
    asyncWrapper(toppingController.create),
);

router.get('/', asyncWrapper(toppingController.get));

export default router;
