import { Document, ObjectId, WithId } from 'mongodb';

export interface IngredientEntity extends WithId<Document> {
    _id: ObjectId;
    name: string;
    price: number;
}

export interface NewIngredientEntity extends Omit<IngredientEntity, '_id'> {
    _id?: ObjectId;
}
