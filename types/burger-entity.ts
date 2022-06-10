import { IngredientType } from './ingredient-type';
import { WithId, Document, ObjectId } from 'mongodb';

export interface BurgerEntity extends WithId<Document> {
    _id: ObjectId;
    name: string;
    ingredients: IngredientType[];
    price: number;
    img: string;
}

export interface NewBurgerEntity extends Omit<BurgerEntity, '_id'> {
    _id?: ObjectId;
}
