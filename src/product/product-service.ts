import productModel from './product-model';
import { Product } from './product-types';

export class ProductService {
    createProduct = async (product: Product) => {
        return await productModel.create(product);
    };
    updateProduct = async (productId: string, product: Product) => {
        return await productModel.findOneAndUpdate(
            {
                _id: productId,
            },
            { $set: product },
            { new: true },
        );
    };
    getProduct = async (productId: string): Promise<Product | null> => {
        return await productModel.findById({ _id: productId });
    };
    getProductImage = async (productId: string) => {
        const product = await productModel.findById(productId);
        if (!product) {
            return undefined;
        }
        return product.image;
    };
}
