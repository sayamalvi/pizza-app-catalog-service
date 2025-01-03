import { NextFunction, Response } from 'express';
import { FileStorage } from '../common/types/storage';
import { ToppingService } from './topping-service';
import {
    CreateToppingRequest,
    GetToppingsRequest,
    Topping,
} from './topping-types';
import { v4 as uuidv4 } from 'uuid';

export class ToppingController {
    constructor(
        private readonly storage: FileStorage,
        private readonly toppingService: ToppingService,
    ) {}
    create = async (
        req: CreateToppingRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const image = req.files!.image;
            const fileUuid = uuidv4();

            await this.storage.upload({
                filename: fileUuid,
                fileData: image?.data.buffer as ArrayBuffer,
            });

            const savedTopping = await this.toppingService.create({
                ...req.body,
                image: fileUuid,
                tenantId: req.body.tenantId,
            } as Topping);

            res.status(201).json({ id: savedTopping._id });
        } catch (err) {
            return next(err);
        }
    };
    get = async (
        req: GetToppingsRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const toppings = await this.toppingService.getAll(
                req.query.tenantId,
            );
            const readyToppings = toppings.map((topping) => {
                return {
                    name: topping.name,
                    price: topping.price,
                    tenantId: topping.tenantId,
                    image: this.storage.getObjectUri(topping.image),
                };
            });
            res.json(readyToppings);
        } catch (err) {
            return next(err);
        }
    };
}
