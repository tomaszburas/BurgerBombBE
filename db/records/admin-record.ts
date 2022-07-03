import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { ValidateError } from '../../middlewares/handle-error';
import { validatePassword } from '../../utils/validate-password';
import { AdminEntity, AdminEntityDB, AdminEntityResponse, NewAdminEntity, Role } from '../../types';
import { usersCollection } from '../connect';
import { validationEmail } from '../../utils/validate-email';

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
        if (!validationEmail(this.email)) throw new ValidateError('Incorrect email.');
        if (!validatePassword(this.password))
            throw new ValidateError('Password must contain min. 5 characters, one digit and one upper case character');

        this.password = await bcrypt.hash(this.password, 10);

        const { insertedId } = await usersCollection.insertOne({
            email: String(this.email),
            password: String(this.password),
            role: String(this.role),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    async update({ email, password, role }: NewAdminEntity): Promise<void> {
        if (email) {
            if (!validationEmail(email)) throw new ValidateError('Incorrect email.');
        }

        if (password) {
            if (!validatePassword(password))
                throw new ValidateError(
                    'Password must contain min. 5 characters, one digit and one upper case character'
                );

            password = await bcrypt.hash(password, 10);
        }

        await usersCollection.replaceOne(
            { _id: new ObjectId(this.id) },
            {
                email: email ? String(email) : this.email,
                password: password ? String(password) : this.password,
                role: role ? String(role) : this.role,
            }
        );
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('User id is invalid.');

        await usersCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getById(id: string): Promise<AdminEntity> {
        if (!ObjectId.isValid(id)) throw new ValidateError('User id is invalid.');

        const user = (await usersCollection.findOne({
            _id: new ObjectId(id),
        })) as AdminEntityDB;

        if (!user) throw new ValidateError('In database dont have user with given id.');

        user.id = user._id.toString();

        return new AdminRecord(user);
    }

    static async getByEmail(email: string): Promise<AdminEntity | null> {
        const user = (await usersCollection.findOne({
            email: String(email),
        })) as AdminEntityDB;

        if (!user) return null;

        user.id = user._id.toString();
        return new AdminRecord(user);
    }

    static async login(email: string, password: string): Promise<AdminEntity> {
        const user = await this.getByEmail(email);
        if (!user) throw new ValidateError('User not found');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new ValidateError('Password not valid');

        return new AdminRecord(user);
    }

    static async getAll(): Promise<AdminEntityResponse[]> {
        const cursor = await usersCollection.find().sort({ role: -1, email: 1 });
        const users = await cursor.toArray();

        return users.length === 0
            ? []
            : users.map((user: AdminEntityDB) => ({
                  id: user._id.toString(),
                  email: user.email,
                  role: user.role,
              }));
    }
}
