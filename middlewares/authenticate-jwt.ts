import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { AuthError } from './handle-error';

export const authenticateJwt = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) throw new AuthError();
        req.user = user;
        next();
    })(req, res, next);
};
