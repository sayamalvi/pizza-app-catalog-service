import { body, param } from 'express-validator';
export default [
    param('productId')
        .exists()
        .withMessage('productId is required')
        .isString()
        .withMessage('productId must be a string'),
    body('name')
        .exists()
        .withMessage('name is required')
        .isString()
        .withMessage('Product name must be a string'),
    body('description').exists().withMessage('description is required'),
    body('priceConfiguration')
        .exists()
        .withMessage('priceConfiguration is required'),
    body('attributes').exists().withMessage('attributes are required'),
    body('tenantId').exists().withMessage('tenantId are required'),
    body('categoryId').exists().withMessage('categoryId are required'),
];
