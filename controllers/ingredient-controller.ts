import { Request, Response } from 'express';
import { ValidateError } from '../middlewares/handle-error';
import { IngredientRecord } from '../db/records/ingredient-record';
import { BurgerRecord } from '../db/records/burger-record';

export class IngredientController {
    static async getIngredients(req: Request, res: Response) {
        const ingredients = await IngredientRecord.getAll();

        res.status(200).json({
            success: true,
            ingredients,
        });
    }

    static async getIngredient(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect ingredient id.');

        const ingredient = await IngredientRecord.getOne(id);

        res.status(200).json({
            success: true,
            ingredient,
        });
    }

    static async addIngredient(req: Request, res: Response) {
        const ingredient = new IngredientRecord(req.body);
        await ingredient.add();

        res.status(201).json({
            success: true,
        });
    }

    static async updateIngredient(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect ingredient id.');

        const ingredient = await IngredientRecord.getOne(id);

        if (req.body.name) ingredient.name = req.body.name;
        if (req.body.price) ingredient.price = Number(req.body.price);

        await ingredient.update();
    }

    static async deleteIngredient(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect ingredient id.');

        const burger = await BurgerRecord.getOne(id);
        await burger.delete();

        res.status(200).json({
            success: true,
        });
    }
}
