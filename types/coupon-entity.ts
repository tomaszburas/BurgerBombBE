import { Document, ObjectId, WithId } from 'mongodb';

export interface CouponEntity extends WithId<Document> {
    _id: ObjectId;
    name: string;
    value: number;
}

export interface NewCouponEntity extends Omit<CouponEntity, '_id'> {
    _id?: ObjectId;
}
