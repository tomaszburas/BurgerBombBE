import { Request } from 'express';
import passportJwt from 'passport-jwt';
import passport from 'passport';
import { AdminEntity } from '../types';
import { ACCESS_TOKEN } from '../config';
import { AdminRecord } from '../db/records/admin-record';

declare module 'express' {
    export interface Request {
        user: AdminEntity;
    }
}

interface Options {
    jwtFromRequest: (req: Request) => string | null;
    secretOrKey: string;
}

const cookieExtractor = (req: Request): string | null => {
    let token = null;
    if (req && req.cookies) token = req.cookies['access_token'];
    return token;
};

const JwtStrategy = passportJwt.Strategy;

const opts: Options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: ACCESS_TOKEN,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        console.log(jwt_payload);
        console.log(jwt_payload._id);
        const user = await AdminRecord.getById(jwt_payload._id);
        user ? done(null, user) : done(null, false);
    })
);
