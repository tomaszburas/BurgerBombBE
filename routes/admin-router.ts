import { Router } from 'express';
import passport from 'passport';
import { AdminController } from '../controllers/admin-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const AdminRouter = Router();
AdminRouter.use(passport.initialize());

import '../middlewares/passport';

AdminRouter.post('/login', AdminController.login)
    .get('/logout', authenticateJwt, AdminController.logout)
    .post('/', authenticateJwt, AdminController.create);
