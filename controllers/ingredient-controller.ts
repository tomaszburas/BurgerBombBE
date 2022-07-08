import { Request, Response } from 'express';
import { ValidationError } from '../middlewares/handle-error';
import { IngredientRecord } from '../db/records/ingredient-record';
import { BurgerRecord } from '../db/records/burger-record';

export class IngredientController {
    static async getAll(req: Request, res: Response) {
        const ingredients = await IngredientRecord.getAll();

        res.status(200).json({
            success: true,
            ingredients,
        });
    }

    static async getOne(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidationError('Incorrect ingredient id');

        const ingredient = await IngredientRecord.getOne(id);

        res.status(200).json({
            success: true,
            ingredient,
        });
    }

    static async add(req: Request, res: Response) {
        const ingredient = new IngredientRecord(req.body);
        await ingredient.add();

        res.status(201).json({
            success: true,
            message: 'Ingredient added successfully',
            ingredient,
        });
    }

    static async update(req: Request, res: Response) {
        const id = req.params.id;
        const { name, price } = req.body;

        const ingredient = await IngredientRecord.getOne(id);

        ingredient.name = name;
        ingredient.price = price;

        await ingredient.update();

        const burgers = await BurgerRecord.updateIngredient(id, name);

        res.status(200).json({
            success: true,
            message: 'Ingredient updated successfully',
            ingredient,
            burgers,
        });
    }

    static async delete(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidationError('Incorrect ingredient id');

        await IngredientRecord.delete(id);
        const burgers = await BurgerRecord.deleteIngredient(id);

        res.status(200).json({
            success: true,
            message: 'Ingredient removed',
            id: req.params.id,
            burgers,
        });
    }
}
