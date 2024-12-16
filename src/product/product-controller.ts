import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { ProductService } from './product-service';
import { Product } from './product-types';
import { FileStorage } from '../common/types/storage';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';

export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly storage: FileStorage,
    ) {}
    create = async (
        req: Request<object, unknown, Product, object>,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();

        await this.storage.upload({
            filename: imageName,
            fileData: image.data.buffer,
        });
        const product = await this.productService.createProduct({
            ...req.body,
            priceConfiguration: JSON.parse(req.body.priceConfiguration),
            attributes: JSON.parse(req.body.attributes),
            image: imageName,
        });
        res.status(201).json(product.id);
    };
    update = async (
        req: Request<object, unknown, Product, object>,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        let imageName: string | undefined;
        let oldImage: string | undefined;
        if (req.files?.image) {
            oldImage = await this.productService.getProductImage(
                (req.params as { productId: string }).productId,
            );
            const image = req.files.image as UploadedFile;
            imageName = uuidv4();

            await this.storage.upload({
                filename: imageName,
                fileData: image.data.buffer,
            });
            await this.storage.delete(oldImage as string);
        }
        const updatedProduct = await this.productService.updateProduct(
            (req.params as { productId: string }).productId,
            {
                ...req.body,
                priceConfiguration: JSON.parse(req.body.priceConfiguration),
                attributes: JSON.parse(req.body.attributes),
                image: imageName ?? (oldImage as string),
            },
        );
        res.json({ id: updatedProduct?.id });
    };
}
