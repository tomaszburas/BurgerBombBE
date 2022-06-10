import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { ValidateError } from '../../middlewares/handle-error';
import { validatePassword } from '../../utils/validate-password';
import { AdminEntity, NewAdminEntity } from '../../types';
import { usersCollection } from '../connect';

export class AdminRecord implements AdminEntity {
    _id: ObjectId;
    name: string;
    password: string;

    constructor(obj: NewAdminEntity) {
        this.name = obj.name;
        this.password = obj.password;
    }

    async create(): Promise<AdminEntity['_id']> {
        if (this.name.length < 3 || this.name.length > 20) throw new ValidateError('Username is to long.');

        if (!validatePassword(this.password))
            throw new ValidateError('Password must contain min. 5 characters, one digit and one upper case character');

        this.password = await bcrypt.hash(this.password, 10);

        const { insertedId } = await usersCollection.insertOne({
            name: String(this.name),
            password: String(this.password),
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

    static async getByName(name: AdminEntity['name']): Promise<AdminEntity | null> {
        const user = (await usersCollection.findOne({
            name: String(name),
        })) as AdminEntity;

        return user ? new AdminRecord(user) : null;
    }

    static async login(name: AdminEntity['name'], password: AdminEntity['password']): Promise<AdminEntity> {
        const user = (await usersCollection.findOne({ name })) as AdminEntity;
        if (!user) throw new ValidateError('User not found');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new ValidateError('Password not valid');

        return new AdminRecord(user);
    }
}
