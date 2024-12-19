import { body, param } from 'express-validator';
import { Request } from 'express';

export default [
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
    body('image').custom((value, { req }) => {
        if (!req.files) {
            throw new Error('Image is required');
        }
        return true;
    }),
    param('id').custom((value, { req }) => {
        if (['PUT', 'DELETE', 'PATCH'].includes((req as Request).method)) {
            if (!value) {
                throw new Error('id is required');
            }
        }
        return true;
    }),
];
