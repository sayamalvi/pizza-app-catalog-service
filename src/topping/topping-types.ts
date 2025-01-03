import { UploadedFile } from 'express-fileupload';
import mongoose from 'mongoose';
import { Request } from 'express';

export interface Topping {
    _id?: mongoose.Types.ObjectId;
    name: string;
    price: number;
    tenantId: string;
    image: string;
}

export interface CreateToppingRequest extends Request {
    body: {
        name: string;
        price: number;
        tenantId: string;
    };
    files?: {
        image?: UploadedFile;
    };
}

export interface GetToppingsRequest extends Request {
    query: {
        tenantId: string;
    };
}
