import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export class ValidationError extends Error {}
export class AuthError extends Error {}

export const handleError = (err: any, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof AuthError) {
        res.status(401).json({
            success: false,
            message: 'User is not authenticated.',
        });
        return;
    }

    if (err instanceof ValidationError) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
        return;
    }

    if (err instanceof multer.MulterError) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
        return;
    }

    let message = '';
    if (err.sqlState) message = 'Database problem';
    if (err.errno === 1062) message = 'A user with this username exists in our database';

    res.status(err.errno === 1062 ? 400 : 500).json({
        success: false,
        message: message ? message : 'Sorry, please try again in a while',
    });
};
