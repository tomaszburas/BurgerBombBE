import { Router } from 'express';
import { OrderController } from '../controllers/order-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const OrderRouter = Router();

OrderRouter.post('/', OrderController.add)
    .delete('/:id', authenticateJwt, OrderController.delete)
    .put('/:id', authenticateJwt, OrderController.updateStatus)
    .get('/', authenticateJwt, OrderController.getAll)
    .get('/:id', authenticateJwt, OrderController.getOne);
