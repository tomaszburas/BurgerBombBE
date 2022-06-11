import { Router } from 'express';
import { BurgerController } from '../controllers/burger-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const BurgerRouter = Router();

BurgerRouter.get('/', BurgerController.getBurgers)
    .get('/:id', BurgerController.getBurger)
    .post('/', authenticateJwt, BurgerController.addBurger)
    .put('/:id', authenticateJwt, BurgerController.updateBurger)
    .delete('/:id', authenticateJwt, BurgerController.deleteBurger);
