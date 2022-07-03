import { Router } from 'express';
import { AdminController } from '../controllers/admin-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const AdminRouter = Router();

AdminRouter.post('/login', AdminController.login)
    .get('/logout', authenticateJwt, AdminController.logout)
    .get('/auth', authenticateJwt, AdminController.auth)
    .get('/', authenticateJwt, AdminController.getAll)
    .post('/', authenticateJwt, AdminController.create)
    .put('/:id', authenticateJwt, AdminController.update)
    .delete('/:id', authenticateJwt, AdminController.delete);
