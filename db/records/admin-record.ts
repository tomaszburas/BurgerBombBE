import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { ValidationError } from '../../middlewares/handle-error';
import { validationPassword } from '../../utils/validation-password';
import { AdminEntity, AdminEntityResponse, NewAdminEntity } from '../../types';
import { usersCollection } from '../connect';
import { validationEmail } from '../../utils/validation-email';

export class AdminRecord implements AdminEntity {
    id: string;
    email: string;
    password: string;
    role: string;

    constructor(obj: NewAdminEntity) {
        this.id = obj.id;
        this.email = obj.email;
        this.password = obj.password;
        this.role = obj.role;
    }

    async create(): Promise<string> {
        if (!validationEmail(this.email)) throw new ValidationError('Incorrect email');
        if (!validationPassword(this.password))
            throw new ValidationError(
                'Password must contain min. 5 characters, one digit and one upper case character'
            );

        this.password = await bcrypt.hash(this.password, 10);

        const { insertedId } = await usersCollection.insertOne({
            email: String(this.email),
            password: String(this.password),
            role: String(this.role),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    async update(password: string): Promise<void> {
        if (!validationEmail(this.email)) throw new ValidationError('Incorrect email');

        if (password.length > 0) {
            if (!validationPassword(password))
                throw new ValidationError(
                    'Password must contain min. 5 characters, one digit and one upper case character'
                );

            this.password = await bcrypt.hash(password, 10);
        }

        await usersCollection.updateOne(
            { _id: new ObjectId(this.id) },
            {
                $set: {
                    email: String(this.email),
                    password: String(this.password),
                    role: String(this.role),
                },
            }
        );
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidationError('User id is invalid');
        await usersCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getById(id: string): Promise<AdminRecord> {
        if (!ObjectId.isValid(id)) throw new ValidationError('User id is invalid');

        const user = (await usersCollection.findOne({
            _id: new ObjectId(id),
        })) as NewAdminEntity;

        if (!user) throw new ValidationError('In database dont have user with given id');

        user.id = user._id.toString();

        return new AdminRecord(user);
    }

    static async getByEmail(email: string): Promise<AdminRecord | null> {
        const user = (await usersCollection.findOne({
            email: String(email),
        })) as NewAdminEntity;

        if (!user) return null;

        user.id = user._id.toString();
        return new AdminRecord(user);
    }

    static async login(email: string, password: string): Promise<AdminRecord> {
        const user = await this.getByEmail(email);
        if (!user) throw new ValidationError('User not found');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new ValidationError('Password not valid');

        return new AdminRecord(user);
    }

    static async getAll(): Promise<AdminEntityResponse[]> {
        const cursor = await usersCollection.find().sort({ role: -1, email: 1 });
        const users = await cursor.toArray();

        return users.length === 0
            ? []
            : users.map((user) => ({
                  id: user._id.toString(),
                  email: user.email,
                  role: user.role,
              }));
    }
}
