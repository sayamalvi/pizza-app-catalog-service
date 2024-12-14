import mongoose from 'mongoose';
import { Category, PriceConfiguration, Attribute } from './category-types';

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: { type: String, enum: ['base', 'additional'] },
    avaliableOptions: [{ type: String, required: true }],
});

const attributeSchema = new mongoose.Schema<Attribute>({
    name: { type: String, required: true },
    widgetType: { type: String, enum: ['switch', 'radio'], required: true },
    defaultValue: { type: mongoose.Schema.Types.Mixed, required: true },
    avaliableOptions: [{ type: String, required: true }],
});

const categorySchema = new mongoose.Schema<Category>({
    name: { type: String, required: true },
    priceConfiguration: {
        type: Map,
        of: priceConfigurationSchema,
        required: true,
    },
    attributes: {
        type: [attributeSchema],
        required: true,
    },
});

export default mongoose.model<Category>('Category', categorySchema);
