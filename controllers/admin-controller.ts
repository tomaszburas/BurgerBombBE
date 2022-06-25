import { Request, Response } from 'express';
import { AdminRecord } from '../db/records/admin-record';
import { ACCESS_TOKEN } from '../config';
import jwt from 'jsonwebtoken';
import { ValidateError } from '../middlewares/handle-error';
import { validationEmail } from '../utils/validate-email';

export class AdminController {
    static async login(req: Request, res: Response) {
        const { mail, password } = req.body;

        const user = await AdminRecord.login(mail, password);

        const payload = {
            _id: user._id,
            mail: user.mail,
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
        const { mail, password } = req.body;

        // if (req.user.role !== Role.SUPER_ADMIN) throw new ValidateError('No permissions');
        if (validationEmail(mail)) throw new ValidateError('Incorrect email.');

        const userEntity = await AdminRecord.getByMail(mail);
        if (userEntity) throw new ValidateError('This username has been taken.');

        const user = new AdminRecord({
            mail,
            password,
        });

        await user.create();

        res.status(201).json({ success: true });
    }

    static async delete(req: Request, res: Response) {
        // if (req.user.role !== Role.SUPER_ADMIN) throw new ValidateError('No permissions');

        await AdminRecord.delete(req.body.id);

        res.status(200).json({ success: true });
    }
}
