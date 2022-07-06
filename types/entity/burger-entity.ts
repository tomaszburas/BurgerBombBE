import { ObjectId } from 'mongodb';
import { BurgerIngredient } from './ingredient-entity';

export interface BurgerEntity {
    id: string;
    name: string;
    ingredients: BurgerIngredient[];
    price: number;
    active: boolean;
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

export interface BurgerForm {
    name: string;
    price: number;
    img: any;
    active: boolean;
    ingredients: string[];
}
