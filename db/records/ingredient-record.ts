import { IngredientType } from '../../types';
import { ObjectId } from 'mongodb';
import { ingredientsCollection } from '../connect';
import { ValidateError } from '../../middlewares/handle-error';

export class IngredientRecord implements IngredientType {
    _id: ObjectId | null;
    name: string;
    price: number;

    constructor(obj: IngredientType) {
        this._id = obj._id;
        this.name = obj.name;
        this.price = obj.price;
    }

    async add(): Promise<IngredientType['_id']> {
        const { insertedId } = await ingredientsCollection.insertOne({
            name: String(this.name),
            price: Number(this.price),
        });

        this._id = insertedId;
        return insertedId;
    }

    async delete(): Promise<void> {
        await ingredientsCollection.deleteOne({ _id: this._id });
    }

    async update(): Promise<void> {
        if (typeof this.name !== 'string') {
            throw new ValidateError('Typeof name must be a string');
        }

        if (typeof this.price !== 'number') {
            throw new ValidateError('Typeof name must be a string');
        }

        await ingredientsCollection.replaceOne(
            { _id: this._id },
            {
                name: String(this.name),
                price: Number(this.price),
            }
        );
    }

    static async getOne(id: string): Promise<IngredientType> {
        if (!ObjectId.isValid(id)) {
            throw new ValidateError('Ingredient id is invalid.');
        }

        const item = (await ingredientsCollection.findOne({
            _id: new ObjectId(id),
        })) as IngredientType;

        if (!item) throw new ValidateError('In database dont have ingredient with given id.');

        return new IngredientRecord(item);
    }

    static async getAll(): Promise<IngredientType[]> {
        const result = await ingredientsCollection.find();
        const resultArray = (await result.toArray()) as IngredientType[];

        if (!resultArray.length) throw new ValidateError('Id database dont have any ingredients.');

        return resultArray;
    }
}
