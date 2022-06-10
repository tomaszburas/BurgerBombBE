import { Document, ObjectId, WithId } from 'mongodb';
import { BurgerEntity } from './burger-entity';
import { CouponEntity } from './coupon-entity';
import { IngredientType } from './ingredient-type';

export enum OrderStatus {
    NEW,
    IN_PROGRESS,
    COMPLETED,
}

export interface OrderType extends WithId<Document> {
    _id: ObjectId | null;
    client: {
        fullName: string;
        address: string;
        phone: string;
        mail: string;
    };
    order: {
        burger: BurgerEntity['_id'];
        extraIngredients: IngredientType['_id'][] | [];
        price: number;
        coupon: CouponEntity['_id'];
    };
    status: OrderStatus;
}
