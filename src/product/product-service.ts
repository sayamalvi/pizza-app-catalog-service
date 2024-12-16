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
    getAllProducts = async (
        search: string,
        filters: Filter,
        page: number = 1,
        limit: number = 5,
    ) => {
        const searchQueryRegex = new RegExp(search, 'i');
        const matchQuery = {
            ...filters,
            name: searchQueryRegex,
        };
        const totalProducts = await productModel.countDocuments(matchQuery);
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
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit,
            },
        ]);
        const result = await aggregate.exec();
        return {
            products: result as Product[],
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        };
    };
}
