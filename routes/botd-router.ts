import { Router } from 'express';
import { BotdController } from '../controllers/botd-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';
import { checkPermissions } from '../utils/check-permissions';

export const BotdRouter = Router();

BotdRouter.get('/', BotdController.get).post('/', authenticateJwt, BotdController.save);
