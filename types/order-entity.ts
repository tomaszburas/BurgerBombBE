import { Document, ObjectId, WithId } from 'mongodb';
import { BurgerEntity } from './burger-entity';
import { CouponEntity } from './coupon-entity';
import { IngredientEntity } from './ingredient-entity';

export enum OrderStatus {
    NEW = 'new',
    IN_PROGRESS = 'in progress',
    COMPLETED = 'completed',
}

export interface OrderEntity extends WithId<Document> {
    _id: ObjectId;
    client: {
        fullName: string;
        address: string;
        phone: string;
        mail: string;
    };
    order: {
        burger: BurgerEntity['_id'];
        extraIngredients: IngredientEntity['_id'][] | [];
        price: number;
        coupon: CouponEntity['_id'];
    };
    status: OrderStatus;
}

export interface NewOrderEntity extends Omit<OrderEntity, '_id'> {
    _id?: ObjectId;
}
