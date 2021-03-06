import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { BurgerRouter } from './routes/burger-router';
import { AdminRouter } from './routes/admin-router';
import { IngredientRouter } from './routes/ingredient-router';
import { OrderRouter } from './routes/order-router';
import { handleError } from './middlewares/handle-error';
import { PORT } from './config';
import { CouponRouter } from './routes/coupon-router';

import './middlewares/passport';
import { InfoRouter } from './routes/info-router';
import { BotdRouter } from './routes/botd-router';

const app = express();

app.use(express.static('./public'));
app.use(json());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(passport.initialize());

const URL = '/api';
app.use(`${URL}/burger`, BurgerRouter);
app.use(`${URL}/ingredient`, IngredientRouter);
app.use(`${URL}/admin`, AdminRouter);
app.use(`${URL}/order`, OrderRouter);
app.use(`${URL}/coupon`, CouponRouter);
app.use(`${URL}/info`, InfoRouter);
app.use(`${URL}/botd`, BotdRouter);

app.use(handleError);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
