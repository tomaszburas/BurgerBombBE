import { Router } from 'express';
import { CouponController } from '../controllers/coupon-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const CouponRouter = Router();

CouponRouter.post('/', authenticateJwt, CouponController.add)
    .delete('/:id', authenticateJwt, CouponController.delete)
    .put('/:id', authenticateJwt, CouponController.update)
    .get('/', authenticateJwt, CouponController.getAll)
    .get('/:id', CouponController.getOne);
