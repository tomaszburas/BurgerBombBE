import { ObjectId } from 'mongodb';
import { BasketEntity } from './basket-entity';
import { CouponEntity } from './coupon-entity';

export enum OrderStatus {
    NEW = 'new',
    IN_PROGRESS = 'in progress',
    COMPLETED = 'completed',
}

export enum PaymentMethod {
    CARD = 'card',
    CASH = 'cash',
}

export interface OrderEntity {
    id: string;
    client: {
        firstName: string;
        lastName: string;
        street: string;
        number: string;
        zipCode: string;
        city: string;
        phone: string;
        email: string;
        accRules: boolean;
    };
    order: BasketEntity[];
    coupon: CouponEntity | null;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    value: number;
    orderNumber: number;
    date: Date;
}

export interface NewOrderEntity extends Omit<OrderEntity, 'id'> {
    _id?: ObjectId;
    id?: string;
}

export interface OrderFormEntity {
    firstName: string;
    lastName: string;
    street: string;
    number: string;
    zipCode: string;
    city: string;
    phone: string;
    email: string;
    paymentMethod: string;
    accRules: boolean;
}
