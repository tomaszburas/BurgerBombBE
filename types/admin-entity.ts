import { ObjectId } from 'mongodb';

export interface AdminEntity {
    _id: ObjectId;
    name: string;
    password: string;
}

export interface NewAdminEntity extends Omit<AdminEntity, '_id'> {
    _id?: ObjectId;
}
