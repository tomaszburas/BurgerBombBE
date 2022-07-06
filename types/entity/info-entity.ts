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
}

export interface NewInfoEntity extends Omit<InfoEntity, 'id'> {
    id?: string;
}

export interface InfoEntityDB extends Omit<InfoEntity, 'id'> {
    _id: ObjectId;
}

export interface InfoEntityResponse extends InfoEntity {}
