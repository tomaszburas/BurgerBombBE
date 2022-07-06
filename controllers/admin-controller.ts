import { Request, Response } from 'express';
import { AdminRecord } from '../db/records/admin-record';
import { ACCESS_TOKEN } from '../config';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../middlewares/handle-error';
import { checkPermissions } from '../utils/check-permissions';

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
                message: 'Logged in successfully',
            });
    }

    static async logout(req: Request, res: Response) {
        res.status(200).clearCookie('access_token').json({
            success: true,
            message: 'Successfully logged out',
        });
    }

    static async create(req: Request, res: Response) {
        checkPermissions(req.user.role);
        const { email, password, role } = req.body;

        const userEntity = await AdminRecord.getByEmail(email);
        if (userEntity) throw new ValidationError('This email has been taken.');

        const user = new AdminRecord({
            email,
            password,
            role,
        });

        await user.create();

        res.status(201).json({
            success: true,
            message: 'User created',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }

    static async delete(req: Request, res: Response) {
        checkPermissions(req.user.role);
        if (req.user.id === req.params.id) throw new ValidationError('You cannot remove yourself');

        await AdminRecord.delete(req.params.id);

        res.status(200).json({ success: true, message: 'User removed', id: req.params.id });
    }

    static async getAll(req: Request, res: Response) {
        const users = await AdminRecord.getAll();

        if (!users) throw new ValidationError('There are no users in the database');

        res.status(200).json({ success: true, users });
    }

    static async update(req: Request, res: Response) {
        checkPermissions(req.user.role);
        const id = req.params.id;
        const { email, role, password } = req.body;

        const user = await AdminRecord.getById(id);

        user.email = email;
        user.role = role;

        await user.update(password);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }
}
