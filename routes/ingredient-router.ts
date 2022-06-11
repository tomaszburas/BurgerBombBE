import { Router } from 'express';
import { IngredientController } from '../controllers/ingredient-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const IngredientRouter = Router();

IngredientRouter.get('/', IngredientController.getIngredients)
    .get('/:id', IngredientController.getIngredient)
    .post('/', authenticateJwt, IngredientController.addIngredient)
    .put('/:id', authenticateJwt, IngredientController.updateIngredient)
    .delete('/:id', authenticateJwt, IngredientController.deleteIngredient);
