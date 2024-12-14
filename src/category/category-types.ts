export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional';
        avaliableOptions: string[];
    };
}
export interface Attribute {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    avaliableOptions: string[];
}
export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

