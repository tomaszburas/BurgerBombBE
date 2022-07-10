import {
    BurgerIngredient,
    IngredientEntity,
    IngredientEntityDB,
    IngredientEntityResponse,
    NewIngredientEntity,
} from '../../types';
import { ObjectId } from 'mongodb';
import { ingredientsCollection } from '../connect';
import { ValidationError } from '../../middlewares/handle-error';
import { round } from '../../utils/round';

export class IngredientRecord implements IngredientEntity {
    id: string;
    name: string;
    price: number;

    constructor(obj: NewIngredientEntity) {
        this.id = obj.id;
        this.name = obj.name;
        this.price = obj.price ? round(obj.price) : 0;
    }

    private valid() {
        if (this.name.length < 3 || this.name.length > 30) {
            throw new ValidationError('Ingredient name must be more than 3 letters and less than 15 characters');
        }
        if (this.price <= 0) {
            throw new ValidationError('Ingredient price must be greater than 0');
        }
    }

    async add(): Promise<string> {
        this.valid();
        const { insertedId } = await ingredientsCollection.insertOne({
            name: String(this.name.toLowerCase()),
            price: Number(this.price),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidationError('User id is invalid');

        await ingredientsCollection.deleteOne({ _id: new ObjectId(id) });
    }

    async update(): Promise<void> {
        this.valid();
        const a = await ingredientsCollection.updateOne(
            { _id: new ObjectId(this.id) },
            {
                $set: {
                    name: String(this.name.toLowerCase()),
                    price: Number(this.price),
                },
            }
        );
    }

    static async getOne(id: string): Promise<IngredientRecord> {
        if (!ObjectId.isValid(id)) {
            throw new ValidationError('Ingredient id is invalid');
        }

        const item = (await ingredientsCollection.findOne({
            _id: new ObjectId(id),
        })) as IngredientEntityDB;

        if (!item) throw new ValidationError('In database dont have ingredient with given id');

        item.id = item._id.toString();

        return new IngredientRecord(item);
    }

    static async getAll(): Promise<IngredientEntityResponse[]> {
        const cursor = await ingredientsCollection.find().sort({ name: 1 });
        const ingredients = await cursor.toArray();

        return ingredients.length === 0
            ? []
            : ingredients.map((ingredient: IngredientEntityDB) => ({
                  id: ingredient._id.toString(),
                  name: ingredient.name,
                  price: ingredient.price,
              }));
    }

    static async getForResponse(ingredients: string[]): Promise<BurgerIngredient[]> {
        return (await Promise.all(ingredients.map((id: string) => IngredientRecord.getOne(id)))).map((ingredient) => ({
            name: ingredient.name,
            id: ingredient.id,
        }));
    }
}
