import { Router } from 'express';
import { IngredientController } from '../controllers/ingredient-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const IngredientRouter = Router();

IngredientRouter.get('/', IngredientController.getAll)
    .get('/:id', IngredientController.getOne)
    .post('/', authenticateJwt, IngredientController.add)
    .put('/:id', authenticateJwt, IngredientController.update)
    .delete('/:id', authenticateJwt, IngredientController.delete);
