import { Request, Response } from 'express';
import { BurgerRecord } from '../db/records/burger-record';
import { ValidateError } from '../middlewares/handle-error';
import { checkIngredients } from '../utils/check-ingredients';

export class BurgerController {
    static async getAll(req: Request, res: Response) {
        const burgers = await BurgerRecord.getAll();

        res.status(200).json({
            success: true,
            burgers,
        });
    }

    static async getOne(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect burger id');

        const burger = await BurgerRecord.getOne(id);

        res.status(200).json({
            success: true,
            burger,
        });
    }

    static async add(req: Request, res: Response) {
        if (!(await checkIngredients(req.body.ingredients)))
            throw new ValidateError('The burger has too few ingredients or an ingredient is not in the database');

        const createBurger = new BurgerRecord(req.body);
        await createBurger.add();

        res.status(201).json({
            success: true,
            message: 'Burger added successfully',
        });
    }

    static async update(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect burger id');

        if (req.body.ingredients >= 3) {
            await checkIngredients(req.body.ingredients);
        }

        const burger = await BurgerRecord.getOne(id);

        const newBurger = {
            name: req.body.name ? req.body.name : '',
            price: req.body.price ? Number(req.body.price) : 0,
            ingredients: req.body.ingredients.length >= 3 ? req.body.ingredients : [],
            img: req.body.img ? req.body.img : '',
        };

        const newBurgerEntity = new BurgerRecord({
            id,
            name: burger.name,
            price: burger.price,
            img: burger.img,
            ingredients: burger.ingredients,
        });

        await newBurgerEntity.update(newBurger);

        res.status(200).json({
            success: true,
        });
    }

    static async delete(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect burger id');

        await BurgerRecord.delete(id);

        res.status(200).json({
            success: true,
            message: 'Burger removed',
        });
    }
}
