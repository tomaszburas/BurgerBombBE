import { Router } from 'express';
import { OrderController } from '../controllers/order-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const OrderRouter = Router();
OrderRouter.use(authenticateJwt)

OrderRouter.post('/', OrderController.add)
    .delete('/:id',  OrderController.delete)
    .put('/:id', OrderController.updateStatus)
    .get('/', OrderController.getAll)
    .get('/:id', OrderController.getOne);
