import express from 'express';
import { CategoryController } from './category-controller';
import { CategoryService } from './category-service';
import logger from '../config/logger';
import { asyncWrapper } from '../common/utils/error-wrapper';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { ROLES } from '../common/enums';
import createCategoryValidator from './validators/create-category-validator';
import categoryValidator from './validators/category-validator';
import updateCategoryValidator from './validators/update-category-validator';

const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN]),
    createCategoryValidator,
    asyncWrapper(categoryController.create),
);
router.get('/', asyncWrapper(categoryController.getAll));
router.get('/:id', categoryValidator, asyncWrapper(categoryController.getById));
router.patch(
    '/:id',
    authenticate,
    canAccess([ROLES.ADMIN]),
    updateCategoryValidator,
    asyncWrapper(categoryController.update),
);
router.delete(
    '/:id',
    authenticate,
    canAccess([ROLES.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.delete),
);

export default router;
