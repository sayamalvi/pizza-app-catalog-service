import config from 'config';
import express, { Request, Response } from 'express';
import { globalErrorHandler } from './common/middlewares/globalErrorHandler';
import categoryRouter from './category/category-router';
import cookieParser from 'cookie-parser';
import productRouter from './product/product-router';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send({ message: config.get('server.port') });
});

app.use(express.json());
app.use(cookieParser());

app.use('/categories', categoryRouter);
app.use('/product', productRouter);

app.use(globalErrorHandler);

export default app;
