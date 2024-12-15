import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { ProductService } from './product-service';
import { Product } from './product-types';

export class ProductController {
    constructor(private readonly productService: ProductService) {}
    create = async (
        req: Request<object, unknown, Product, object>,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const product = await this.productService.createProduct({
            ...req.body,
            priceConfiguration: JSON.parse(req.body.priceConfiguration),
            attributes: JSON.parse(req.body.attributes),
        });
        res.status(201).json(product.id);
    };
}
