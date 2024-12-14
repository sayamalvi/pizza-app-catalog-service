import CategoryModel from './category-model';
import { Category } from './category-types';

export class CategoryService {
    create(category: Category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }
}
