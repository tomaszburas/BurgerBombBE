import { ObjectId } from 'mongodb';

export interface BurgerEntity {
    id: string;
    name: string;
    ingredients: string[];
    price: number;
    img: string;
}

export interface NewBurgerEntity extends Omit<BurgerEntity, 'id'> {
    id?: string;
}

export interface BurgerEntityDB extends Omit<BurgerEntity, 'id'> {
    _id: ObjectId;
    id?: string;
}

export interface BurgerEntityResponse extends BurgerEntity {}
