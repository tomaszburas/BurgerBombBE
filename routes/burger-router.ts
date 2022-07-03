import { Router } from 'express';
import { BurgerController } from '../controllers/burger-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const BurgerRouter = Router();

BurgerRouter.get('/', BurgerController.getAll)
    .get('/:id', BurgerController.getOne)
    .post('/', authenticateJwt, BurgerController.add)
    .put('/:id', authenticateJwt, BurgerController.update)
    .delete('/:id', authenticateJwt, BurgerController.delete);
