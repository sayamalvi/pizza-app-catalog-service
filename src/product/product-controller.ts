import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { ProductService } from './product-service';
import {
    CreateProductRequest,
    DeleteProductRequest,
    Filter,
    GetSingleProductRequest,
    Product,
    UpdateProductRequest,
} from './product-types';
import { FileStorage } from '../common/types/storage';
import { v4 as uuidv4 } from 'uuid';
import { ROLES } from '../common/enums';
import mongoose from 'mongoose';

export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly storage: FileStorage,
    ) {}

    create = async (
        req: CreateProductRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const image = req.files.image;
        const imageName = uuidv4();

        await this.storage.upload({
            filename: imageName,
            fileData: image?.data?.buffer as ArrayBuffer,
        });
        const product = await this.productService.createProduct({
            ...req.body,
            priceConfiguration: JSON.parse(req.body.priceConfiguration),
            attributes: JSON.parse(req.body.attributes),
            image: imageName,
        });
        res.status(201).json({ id: product.id });
    };

    update = async (
        req: UpdateProductRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { productId } = req.params;
        const product = await this.productService.getProduct(productId);
        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }

        let imageName: string | undefined;
        let oldImage: string | undefined;
        if (req.files?.image) {
            oldImage = product.image;
            const image = req.files.image;
            imageName = uuidv4();

            await this.storage.upload({
                filename: imageName,
                fileData: image.data.buffer,
            });
            await this.storage.delete(oldImage);
        }
        const updatedProduct = await this.productService.updateProduct(
            productId,
            {
                ...req.body,
                priceConfiguration: JSON.parse(req.body.priceConfiguration),
                attributes: JSON.parse(req.body.attributes),
                image: imageName ?? (oldImage as string),
            },
        );
        res.json({ id: updatedProduct?.id });
    };

    getAll = async (req: Request, res: Response) => {
        const { search, tenantId, categoryId, isPublished } = req.query;
        const filters: Filter = {};
        if (isPublished === 'true') {
            filters.isPublished = true;
        }
        if (tenantId) {
            filters.tenantId = tenantId as string;
        }
        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }
        const products = await this.productService.getAllProducts(
            search as string,
            filters,
            parseInt(req.query.perPage as string) || 5,
            parseInt(req.query.currentPage as string) || 1,
        );
        const finalProducts = products.products.map((product: Product) => {
            return {
                ...product,
                image: this.storage.getObjectUri(product.image),
            };
        });
        res.json({
            products: finalProducts,
            meta: {
                pagination: {
                    totalProducts: products.totalProducts,
                    totalPages: products.totalPages,
                    currentPage: products.currentPage,
                },
            },
        });
    };

    getById = async (
        req: GetSingleProductRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const { productId } = req.params;
        const product = await this.productService.getProduct(productId);
        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }
        res.json({
            product,
        });
    };

    delete = async (
        req: DeleteProductRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const { productId } = req.params;
        const product = await this.productService.getProduct(productId);
        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (req.auth.role !== ROLES.ADMIN) {
            const tenantId = req.auth.tenant;
            if (product.tenantId != tenantId) {
                return next(
                    createHttpError(
                        403,
                        'You are not allowed to delete this product',
                    ),
                );
            }
        }
        await this.storage.delete(product.image);
        const deletedProductRes =
            await this.productService.deleteProduct(productId);
        res.json({ id: deletedProductRes });
    };
}
