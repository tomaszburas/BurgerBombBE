import { Request, Response } from 'express';
import { BurgerRecord } from '../db/records/burger-record';
import { checkBurgerData } from '../utils/check-burger-data';
import { ValidateError } from '../middlewares/handle-error';
import { Role } from '../types';

export class BurgerController {
    static async getBurgers(req: Request, res: Response) {
        const burgers = await BurgerRecord.getAll();

        res.status(200).json({
            success: true,
            burgers,
        });
    }

    static async getBurger(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect burger id.');

        const burger = await BurgerRecord.getOne(id);

        res.status(200).json({
            success: true,
            burger,
        });
    }

    static async addBurger(req: Request, res: Response) {
        checkBurgerData(req.body);

        const createBurger = new BurgerRecord(req.body);
        await createBurger.add();

        res.status(201).json({
            success: true,
        });
    }

    static async updateBurger(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect burger id.');

        const burger = await BurgerRecord.getOne(id);

        if (req.body.name) burger.name = req.body.name;
        if (req.body.price) burger.price = Number(req.body.price);
        if (req.body.img) burger.img = req.body.img;
        if (req.body.ingredients) burger.ingredients = req.body.ingredients;

        await burger.update();

        res.status(200).json({
            success: true,
        });
    }

    static async deleteBurger(req: Request, res: Response) {
        if (req.user.role !== Role.SUPER_ADMIN) throw new ValidateError('No permissions');

        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect burger id.');

        await BurgerRecord.delete(id);

        res.status(200).json({
            success: true,
        });
    }
}
