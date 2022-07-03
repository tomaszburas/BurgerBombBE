import { IngredientEntity, IngredientEntityDB, NewIngredientEntity } from '../../types';
import { ObjectId } from 'mongodb';
import { ingredientsCollection } from '../connect';
import { ValidateError } from '../../middlewares/handle-error';

export class IngredientRecord implements IngredientEntity {
    id: string;
    name: string;
    price: number;
    quantity: number;

    constructor(obj: NewIngredientEntity) {
        this.id = obj.id;
        this.name = obj.name;
        this.price = obj.price ? Number(obj.price) : 0;
        this.quantity = obj.quantity ? Number(obj.quantity) : 0;
    }

    async add(): Promise<string> {
        if (!this.name) throw new ValidateError('The name of the ingredient is missing');

        const { insertedId } = await ingredientsCollection.insertOne({
            name: String(this.name.toLowerCase()),
            price: Number(this.price),
            quantity: Number(this.quantity),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('User id is invalid');

        await ingredientsCollection.deleteOne({ _id: new ObjectId(id) });
    }

    async update({ name, price, quantity }: NewIngredientEntity): Promise<void> {
        await ingredientsCollection.replaceOne(
            { _id: new ObjectId(this.id) },
            {
                name: name ? String(name.toLowerCase()) : this.name,
                price: price ? Number(price) : this.price,
                quantity: quantity ? Number(quantity) : this.quantity,
            }
        );
    }

    static async getOne(id: string): Promise<IngredientEntity> {
        if (!ObjectId.isValid(id)) {
            throw new ValidateError('Ingredient id is invalid');
        }

        const item = (await ingredientsCollection.findOne({
            _id: new ObjectId(id),
        })) as IngredientEntityDB;

        if (!item) throw new ValidateError('In database dont have ingredient with given id');

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
                  quantity: ingredient.quantity,
              }));
    }
}
