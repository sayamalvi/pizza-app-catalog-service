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
