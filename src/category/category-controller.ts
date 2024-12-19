import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { CategoryService } from './category-service';
import { Logger } from 'winston';
import {
    CreateCategoryRequest,
    DeleteCategoryRequest,
    GetCategoryByIdRequest,
    UpdateCategoryRequest,
} from './category-types';

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private logger: Logger,
    ) {}
    
    create = async (
        req: CreateCategoryRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { name, priceConfiguration, attributes } = req.body;
        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });
        this.logger.info('Category created:', { id: category._id });
        res.json({ id: category._id });
    };

    getAll = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getAll();
        res.json(categories);
    };

    getById = async (
        req: GetCategoryByIdRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;
        const category = await this.categoryService.getById(id);
        if (!category) {
            return next(createHttpError(404, 'Category not found'));
        }
        res.json(category);
    };

    update = async (
        req: UpdateCategoryRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { name, priceConfiguration, attributes } = req.body;
        const category = await this.categoryService.update(id, {
            name,
            priceConfiguration,
            attributes,
        });
        if (!category) {
            return next(createHttpError(404, 'Category not found'));
        }
        this.logger.info('Category updated:', { id });
        res.json({ message: 'Category Updated', id: category._id });
    };

    delete = async (
        req: DeleteCategoryRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;
        const category = await this.categoryService.delete(id);
        if (!category) {
            return next(createHttpError(404, 'Category not found'));
        }
        this.logger.info('Category deleted:', { id });
        res.json({ id });
    };
}
