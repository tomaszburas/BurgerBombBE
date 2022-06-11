import { ObjectId } from 'mongodb';

export enum Role {
    ADMIN,
    SUPER_ADMIN,
}

export interface AdminEntity {
    _id: ObjectId;
    name: string;
    password: string;
    role: Role,
}

export interface NewAdminEntity extends Omit<AdminEntity, '_id' | 'role'> {
    _id?: ObjectId;
    role?: Role;
}
