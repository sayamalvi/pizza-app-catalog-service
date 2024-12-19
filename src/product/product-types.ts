import mongoose from 'mongoose';
import { Request } from 'express';
import { AuthRequest } from '../common/types';
import { UploadedFile } from 'express-fileupload';
export interface Product {
    name: string;
    description: string;
    image: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    isPublished: boolean;
}
export interface Filter {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}

export interface CreateProductRequest extends Request {
    body: Product;
    files: {
        image?: UploadedFile;
    };
}

export interface DeleteProductRequest extends AuthRequest {
    params: {
        productId: string;
    };
}

export interface GetSingleProductRequest extends Request {
    params: {
        productId: string;
    };
}

export interface UpdateProductRequest extends Request {
    body: Product;
    params: {
        productId: string;
    };
    files?: {
        image?: UploadedFile;
    };
}
