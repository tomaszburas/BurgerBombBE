import { IngredientEntity } from './ingredient-entity';
import { WithId, Document, ObjectId } from 'mongodb';

export interface BurgerEntity extends WithId<Document> {
    _id: ObjectId;
    name: string;
    ingredients: IngredientEntity[];
    price: number;
    img: string;
}

export interface NewBurgerEntity extends Omit<BurgerEntity, '_id'> {
    _id?: ObjectId;
}
