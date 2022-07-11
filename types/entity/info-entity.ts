import { ObjectId } from 'mongodb';

export interface InfoEntity {
    id: string;
    street: string;
    number: string;
    zipCode: string;
    city: string;
    phone: string;
    email: string;
    monThu: {
        from: string;
        to: string;
    };
    friSat: {
        from: string;
        to: string;
    };
    sun: {
        from: string;
        to: string;
    };
    orderNumber: number;
}

export interface NewInfoEntity extends Omit<InfoEntity, 'id'> {
    _id?: ObjectId;
    id?: string;
}
