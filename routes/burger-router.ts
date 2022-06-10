import { Router } from 'express';
import { BurgerController } from '../controllers/burger-controller';

export const BurgerRouter = Router();

BurgerRouter.get('/', BurgerController.getBurgers)
    .get('/:id', BurgerController.getBurger)
    .post('/', BurgerController.addBurger)
    .put('/:id', BurgerController.updateBurger)
    .delete('/:id', BurgerController.deleteBurger);
