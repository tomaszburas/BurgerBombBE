import { ObjectId } from 'mongodb';

export enum Role {
    ADMIN = 'Admin',
    SUPER_ADMIN = 'Super Admin',
}

export interface AdminEntity {
    id: string;
    email: string;
    password: string;
    role: string;
}

export interface NewAdminEntity extends Omit<AdminEntity, 'id'> {
    _id?: ObjectId;
    id?: string;
}

export interface AdminEntityResponse extends Omit<AdminEntity, 'password'> {}
