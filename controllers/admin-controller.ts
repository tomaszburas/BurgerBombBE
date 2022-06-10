import { Request, Response } from 'express';
import { AdminRecord } from '../db/records/admin-record';
import { ACCESS_TOKEN } from '../config';
import jwt from 'jsonwebtoken';
import { ValidateError } from '../middlewares/handle-error';

export class AdminController {
    static async login(req: Request, res: Response) {
        const { name, password } = req.body;

        const user = await AdminRecord.login(name, password);

        const payload = {
            _id: user._id,
            name: user.name,
        };

        const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: '1d' });

        res.status(200)
            .cookie('access_token', token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            .json({
                success: true,
            });
    }

    static async logout(req: Request, res: Response) {
        res.status(200).clearCookie('access_token').json({
            success: true,
        });
    }

    static async create(req: Request, res: Response) {
        const { name, password } = req.body;

        const userEntity = await AdminRecord.getByName(name);
        if (userEntity) throw new ValidateError('This username has been taken.')

        const user = new AdminRecord({
            name,
            password,
        });

        await user.create();

        res.status(201).json({ success: true });
    }

    static async delete(req: Request, res: Response) {
        await AdminRecord.delete(req.body.id);

        res.status(200).json({ success: true });
    }
}
