import { Request } from 'express';
export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional';
        availableOptions: string[];
    };
}
export interface Attribute {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    availableOptions: string[];
}
export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

export interface CreateCategoryRequest extends Request {
    body: Category;
}

export interface GetCategoryByIdRequest extends Request {
    params: {
        id: string;
    };
}

export interface UpdateCategoryRequest extends Request {
    params: {
        id: string;
    };
    body: Category;
}

export interface DeleteCategoryRequest extends Request {
    params: {
        id: string;
    };
}
