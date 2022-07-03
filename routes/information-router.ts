import { Router } from 'express';
import { InformationController } from '../controllers/information-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const InformationRouter = Router();

InformationRouter.post('/', InformationController.add)
    .get('/', authenticateJwt, InformationController.get)
    .put('/:id', authenticateJwt, InformationController.update);
