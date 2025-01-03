import mongoose from 'mongoose';
import { Topping } from './topping-types';

const toppingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    tenantId: {
        type: Number,
        required: true,
    },
});

export default mongoose.model<Topping>('Topping', toppingSchema);
