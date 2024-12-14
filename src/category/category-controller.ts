import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { Category } from './category-types';
import { CategoryService } from './category-service';
import { Logger } from 'winston';

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private logger: Logger,
    ) {}
    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { name, priceConfiguration, attributes } = req.body as Category;
        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });
        this.logger.info('Category created:', { id: category._id });
        res.json({ id: category._id });
    };
}