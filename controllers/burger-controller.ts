import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import { BurgerRecord } from '../db/records/burger-record';
import { ValidationError } from '../middlewares/handle-error';
import { IngredientRecord } from '../db/records/ingredient-record';
import path from 'path';

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
        if (!id) throw new ValidationError('Incorrect burger id');

        const burger = await BurgerRecord.getOne(id);

        res.status(200).json({
            success: true,
            burger,
        });
    }

    static async add(req: Request, res: Response) {
        const { name, price, ingredients, active } = req.body;
        const filename = req.file ? req.file.filename : null;

        const burger = new BurgerRecord({
            name: name.toLowerCase(),
            price: Number(price),
            img: filename,
            ingredients: await IngredientRecord.getForResponse(JSON.parse(ingredients)),
            active: JSON.parse(active),
        });
        await burger.add();

        res.status(201).json({
            success: true,
            message: 'Burger added successfully',
            burger,
        });
    }

    static async update(req: Request, res: Response) {
        const id = req.params.id;
        const { name, price, ingredients, active } = req.body;

        const burger = await BurgerRecord.getOne(id);

        if (req.file) {
            fs.unlink(path.join(__dirname, '../public', 'images', burger.img));
        }

        burger.name = name.toLowerCase();
        burger.price = Number(price);
        burger.ingredients = await IngredientRecord.getForResponse(JSON.parse(ingredients));
        burger.active = JSON.parse(active);
        burger.img = req.file ? req.file.filename : burger.img;

        await burger.update();

        res.status(200).json({
            success: true,
            message: 'Burger updated successfully',
            burger,
        });
    }

    static async delete(req: Request, res: Response) {
        const id = req.params.id;
        const { img } = await BurgerRecord.getOne(id);
        await BurgerRecord.delete(id);
        fs.unlink(path.join(__dirname, '../public', 'images', img));

        res.status(200).json({
            success: true,
            message: 'Burger removed',
            id,
        });
    }

    static async updateActive(req: Request, res: Response) {
        const id = req.params.id;
        const active = req.body.active;

        await BurgerRecord.updateActive(id, active);

        res.status(200).json({
            success: true,
        });
    }
}
