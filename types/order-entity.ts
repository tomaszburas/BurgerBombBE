import { Document, ObjectId, WithId } from 'mongodb';

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
        address: {
            street: string;
            number: string;
            zipCode: string;
            city: string;
        };
        phone: string;
        email: string;
    };
    order: {
        burger: string;
        extraIngredients: string[];
        price: number;
        coupon: string;
        payment: {
            method: PaymentMethod;
        };
    };
    status: OrderStatus;
}

export interface NewOrderEntity extends Omit<OrderEntity, 'id'> {
    id?: string;
}
