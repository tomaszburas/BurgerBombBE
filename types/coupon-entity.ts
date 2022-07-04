import { ObjectId } from 'mongodb';

export interface CouponEntity {
    id: string;
    name: string;
    value: number;
}

export interface NewCouponEntity extends Omit<CouponEntity, 'id'> {
    id?: string;
}

export interface CouponEntityDB extends Omit<CouponEntity, 'id'> {
    _id: ObjectId;
    id?: string;
}

export interface CouponEntityResponse extends CouponEntity {}
