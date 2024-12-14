import mongoose from 'mongoose';

const attributeValueSchema = new mongoose.Schema({
    name: { type: String },
    value: { type: mongoose.Schema.Types.Mixed },
});
const priceConfigurationSchema = new mongoose.Schema({
    priceType: { type: String, enum: ['base', 'additional'] },
    avaliableOptions: {
        type: Map,
        of: Number,
    },
});
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
        },
        attributes: [attributeValueSchema],
        tenantId: {
            type: String,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        isPublished: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true },
);

export default mongoose.model('Product', productSchema);