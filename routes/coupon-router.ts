import { Router } from 'express';
import { CouponController } from '../controllers/coupon-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const CouponRouter = Router();
CouponRouter.use(authenticateJwt);

CouponRouter.post('/', CouponController.add)
    .delete('/:id', CouponController.delete)
    .put('/:id', CouponController.update)
    .get('/', CouponController.getAll)
    .get('/:id', CouponController.getOne);
