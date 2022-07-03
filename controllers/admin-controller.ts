import { Request, Response } from 'express';
import { AdminRecord } from '../db/records/admin-record';
import { ACCESS_TOKEN } from '../config';
import jwt from 'jsonwebtoken';
import { ValidateError } from '../middlewares/handle-error';
import { Role } from '../types';

export class AdminController {
    static async auth(req: Request, res: Response) {
        if (req.user) {
            res.status(200).json({
                success: true,
            });
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await AdminRecord.login(email, password);

        const payload = {
            id: user.id,
            mail: user.email,
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
        if (req.user.role !== Role.SUPER_ADMIN) throw new ValidateError('Only super admin can add new users');
        const { email, password, role } = req.body;

        const userEntity = await AdminRecord.getByEmail(email);
        if (userEntity) throw new ValidateError('This email has been taken.');

        const user = new AdminRecord({
            email,
            password,
            role,
        });

        await user.create();

        res.status(201).json({ success: true, message: 'User created' });
    }

    static async delete(req: Request, res: Response) {
        if (req.user.role !== Role.SUPER_ADMIN) throw new ValidateError('Only super admin can remove users');
        if (req.user.id === req.params.id) throw new ValidateError('You cannot remove yourself');

        await AdminRecord.delete(req.params.id);

        res.status(200).json({ success: true, message: 'User removed' });
    }

    static async getAll(req: Request, res: Response) {
        const users = await AdminRecord.getAll();

        if (!users) throw new ValidateError('There are no users in the database');

        res.status(200).json({ success: true, users });
    }

    static async update(req: Request, res: Response) {
        if (req.user.role !== Role.SUPER_ADMIN) throw new ValidateError('Only super admin can update users');

        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect user id.');

        const user = await AdminRecord.getById(id);

        const newUser = {
            email: req.body.email ? req.body.email : '',
            password: req.body.password ? req.body.password : '',
            role: req.body.role ? req.body.role : '',
        };

        const newUserEntity = new AdminRecord({
            id,
            email: user.email,
            password: user.password,
            role: user.role,
        });

        await newUserEntity.update(newUser);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
        });
    }
}
