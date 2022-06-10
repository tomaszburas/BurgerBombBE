import { Router } from 'express';
import { IngredientController } from '../controllers/ingredient-controller';

export const IngredientRouter = Router();

IngredientRouter.get('/', IngredientController.getIngredients)
    .get('/:id', IngredientController.getIngredient)
    .post('/', IngredientController.addIngredient)
    .put('/:id', IngredientController.updateIngredient)
    .delete('/:id', IngredientController.deleteIngredient);
