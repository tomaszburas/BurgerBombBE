import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { BurgerController } from '../controllers/burger-controller';
import { authenticateJwt } from '../middlewares/authenticate-jwt';

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public', 'images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage, limits: { fileSize: 2621440 } });

export const BurgerRouter = Router();

BurgerRouter.get('/', BurgerController.getAll)
    .get('/:id', BurgerController.getOne)
    .post('/', authenticateJwt, upload.single('img'), BurgerController.add)
    .put('/:id', authenticateJwt, upload.single('img'), BurgerController.update)
    .put('/active/:id', authenticateJwt, BurgerController.updateActive)
    .delete('/:id', authenticateJwt, BurgerController.delete);
