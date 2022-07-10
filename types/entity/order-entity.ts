import { ObjectId } from 'mongodb';
import { BasketEntity } from './basket-entity';

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
    coupon: string | null;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
}

export interface NewOrderEntity extends Omit<OrderEntity, 'id'> {
    id?: string;
}

export interface OrderEntityDB extends Omit<OrderEntity, 'id'> {
    _id: ObjectId;
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
