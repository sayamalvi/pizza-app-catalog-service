import productModel from './product-model';
import { Filter, Product } from './product-types';

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
    getAllProducts = async (search: string, filters: Filter) => {
        const searchQueryRegex = new RegExp(search, 'i');
        const matchQuery = {
            ...filters,
            name: searchQueryRegex,
        };
        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$category',
            },
        ]);
        const result = await aggregate.exec();
        return result as Product[];
    };
}
