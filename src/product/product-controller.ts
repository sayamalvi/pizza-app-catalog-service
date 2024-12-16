import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { ProductService } from './product-service';
import { Product } from './product-types';
import { FileStorage } from '../common/types/storage';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import { AuthRequest } from '../common/types';
import { ROLES } from '../common/enums';

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
    update = async (req: Request, res: Response, next: NextFunction) => {
        const _req = req as Request<object, unknown, Product, object> &
            AuthRequest;
        const result = validationResult(_req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const productId = (_req.params as { productId: string }).productId;
        const product = await this.productService.getProduct(productId);
        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (_req.auth.role !== ROLES.ADMIN) {
            const tenantId = _req.auth.tenant;
            if (product.tenantId != tenantId) {
                return next(
                    createHttpError(
                        403,
                        'You are not allowed to update this product',
                    ),
                );
            }
        }
        let imageName: string | undefined;
        let oldImage: string | undefined;
        if (req.files?.image) {
            oldImage = await this.productService.getProductImage(productId);
            const image = req.files.image as UploadedFile;
            imageName = uuidv4();

            await this.storage.upload({
                filename: imageName,
                fileData: image.data.buffer,
            });
            await this.storage.delete(oldImage as string);
        }
        const updatedProduct = await this.productService.updateProduct(
            productId,
            {
                ..._req.body,
                priceConfiguration: JSON.parse(_req.body.priceConfiguration),
                attributes: JSON.parse(_req.body.attributes),
                image: imageName ?? (oldImage as string),
            },
        );
        res.json({ id: updatedProduct?.id });
    };
}
