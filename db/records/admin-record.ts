import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { ValidateError } from '../../middlewares/handle-error';
import { validatePassword } from '../../utils/validate-password';
import { AdminEntity, NewAdminEntity, Role } from '../../types';
import { usersCollection } from '../connect';
import { validationEmail } from '../../utils/validate-email';

export class AdminRecord implements AdminEntity {
    _id: ObjectId;
    email: string;
    password: string;
    role: Role;

    constructor(obj: NewAdminEntity) {
        this._id = obj._id;
        this.email = obj.email;
        this.password = obj.password;
        this.role = obj.role;
    }

    async create(): Promise<AdminEntity['_id']> {
        if (!validationEmail(this.email)) throw new ValidateError('Incorrect email.');
        if (!validatePassword(this.password))
            throw new ValidateError('Password must contain min. 5 characters, one digit and one upper case character');

        this.password = await bcrypt.hash(this.password, 10);

        const { insertedId } = await usersCollection.insertOne({
            email: String(this.email),
            password: String(this.password),
            role: String(this.role),
        });

        this._id = insertedId;
        return insertedId;
    }

    static async delete(id: AdminEntity['password']): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('User id is invalid.');

        await usersCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getById(id: AdminEntity['_id']): Promise<AdminEntity> {
        if (!ObjectId.isValid(id)) throw new ValidateError('User id is invalid.');

        const user = (await usersCollection.findOne({
            _id: new ObjectId(id),
        })) as AdminEntity;

        if (!user) throw new ValidateError('In database dont have user with given id.');

        return new AdminRecord(user);
    }

    static async getByEmail(email: AdminEntity['email']): Promise<AdminEntity | null> {
        const user = (await usersCollection.findOne({
            email: String(email),
        })) as AdminEntity;

        return user ? new AdminRecord(user) : null;
    }

    static async login(email: AdminEntity['email'], password: AdminEntity['password']): Promise<AdminEntity> {
        const user = await this.getByEmail(email);
        if (!user) throw new ValidateError('User not found');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new ValidateError('Password not valid');

        return new AdminRecord(user);
    }
}
