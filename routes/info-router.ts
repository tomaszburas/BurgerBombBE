import { Router } from 'express';
import { InfoController } from '../controllers/info-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

export const InfoRouter = Router();

InfoRouter.get('/', InfoController.get).put('/', authenticateJwt, InfoController.save);
