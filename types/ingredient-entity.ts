import { ObjectId } from 'mongodb';

export interface IngredientEntity {
    id: string;
    name: string;
    price: number;
}

export interface NewIngredientEntity extends Omit<IngredientEntity, 'id'> {
    id?: string;
}

export interface IngredientEntityDB extends Omit<IngredientEntity, 'id'> {
    _id: ObjectId;
}

export interface IngredientEntityResponse extends IngredientEntity {}
