import { IngredientEntity, IngredientEntityDB, NewIngredientEntity } from '../../types';
import { ObjectId } from 'mongodb';
import { ingredientsCollection } from '../connect';
import { ValidationError } from '../../middlewares/handle-error';

export class IngredientRecord implements IngredientEntity {
    id: string;
    name: string;
    price: number;

    constructor(obj: NewIngredientEntity) {
        this.id = obj.id;
        this.name = obj.name;
        this.price = obj.price ? Number(obj.price) : 0;
    }

    async add(): Promise<string> {
        if (!this.name) throw new ValidationError('The name of the ingredient is missing');

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

    async update({ name, price }: NewIngredientEntity): Promise<IngredientEntity> {
        const ingredient = {
            name: name ? String(name.toLowerCase()) : this.name,
            price: price ? Number(price) : this.price,
        };

        await ingredientsCollection.replaceOne(
            { _id: new ObjectId(this.id) },
            {
                ...ingredient,
            }
        );

        return new IngredientRecord({ id: this.id, ...ingredient });
    }

    static async getOne(id: string): Promise<IngredientEntity> {
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

    static async getAll(): Promise<IngredientEntity[]> {
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

    static async getNames(arr: string[]): Promise<string[]> {
        return (await this.getAll()).map((e) => {
            const check = arr.findIndex((id: string) => id === e.id);
            if (check >= 0) {
                return e.name;
            }
        });
    }
}
