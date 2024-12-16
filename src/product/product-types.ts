import mongoose from "mongoose";

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

export interface UpdateProductRequest {
    body: Product;
    params: {
        productId: string;
    };
}
export interface ProductRequest {
    body: Product;
}

export interface Filter {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}
