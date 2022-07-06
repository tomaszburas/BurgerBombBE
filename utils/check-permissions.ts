import { Role } from '../types';
import { ValidationError } from '../middlewares/handle-error';

export const checkPermissions = (user: any): boolean => {
    if (user !== Role.SUPER_ADMIN) throw new ValidationError('Only super admin can add new users');
    return true;
};
