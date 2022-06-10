import { Router } from 'express';
import { CouponController } from '../controllers/coupon-controller';

export const CouponRouter = Router();

CouponRouter.post('/', CouponController.add)
    .delete('/:id', CouponController.delete)
    .put('/:id', CouponController.update)
    .get('/', CouponController.getOne)
    .get('/:id', CouponController.getAll);
