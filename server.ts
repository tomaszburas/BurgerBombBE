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

const app = express();

app.use(json());
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/burger', BurgerRouter);
app.use('/ingredient', IngredientRouter);
app.use('/admin', AdminRouter);
app.use('/order', OrderRouter);
app.use('/coupon', CouponRouter);

app.use(handleError);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
