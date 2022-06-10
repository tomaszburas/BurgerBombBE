import { Router } from 'express';
import { OrderController } from '../controllers/order-controller';

export const OrderRouter = Router();

OrderRouter.post('/', OrderController.add)
    .delete('/:id', OrderController.delete)
    .put('/:id', OrderController.updateStatus)
    .get('/', OrderController.getOne)
    .get('/:id', OrderController.getAll);
