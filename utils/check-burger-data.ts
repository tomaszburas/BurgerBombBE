import { BurgerEntity } from '../types';
import { ValidateError } from '../middlewares/handle-error';

export const checkBurgerData = (
    burgerData: Omit<BurgerEntity, '_id'>
): boolean => {
    if (!burgerData.name) throw new ValidateError('Missing burger name.');
    if (!burgerData.ingredients)
        throw new ValidateError('Missing burger ingredients.');
    if (!burgerData.price) throw new ValidateError('Missing burger price.');
    if (!burgerData.img) throw new ValidateError('Missing burger image.');

    return true;
};
