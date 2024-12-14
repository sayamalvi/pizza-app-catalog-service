import CategoryModel from './category-model';
import { Category } from './category-types';

export class CategoryService {
    create(category: Category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }
    getAll() {
        return CategoryModel.find({});
    }
    getById(id: string) {
        return CategoryModel.findById(id);
    }
    update(id: string, category: Category) {
        return CategoryModel.findByIdAndUpdate(id, category);
    }
    delete(id: string) {
        return CategoryModel.findByIdAndDelete(id);
    }
}
