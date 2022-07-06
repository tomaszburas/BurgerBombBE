import { Router } from 'express';
import { InfoController } from '../controllers/info-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const InfoRouter = Router();

InfoRouter.post('/', InfoController.add)
    .get('/', authenticateJwt, InfoController.get)
    .put('/:id', authenticateJwt, InfoController.update);
