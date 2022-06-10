import { Document, ObjectId, WithId } from 'mongodb';

export interface IngredientType extends WithId<Document> {
    _id: ObjectId;
    name: string;
    price: number;
}
