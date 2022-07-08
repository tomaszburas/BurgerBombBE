import { Request, Response } from 'express';
import { BotdRecord } from '../db/records/botd-record';
import { BurgerRecord } from '../db/records/burger-record';

export class BotdController {
    static async get(req: Request, res: Response) {
        res.status(200).json({
            success: true,
            botd: await BotdRecord.get(),
        });
    }

    static async save(req: Request, res: Response) {
        const { burgerId } = req.body;

        const botd = await BotdRecord.get();
        botd.burger = await BurgerRecord.getOne(burgerId);
        await botd.save();

        res.status(200).json({
            success: true,
            message: 'Botd updated successfully',
            botd,
        });
    }
}
