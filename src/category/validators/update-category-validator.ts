import { param } from 'express-validator';
export default [    param('id')
        .exists()
        .withMessage('id is required')
        .isMongoId()
        .withMessage('Invalid category id'),
];
