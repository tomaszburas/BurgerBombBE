import { BurgerEntity, IngredientType, NewBurgerEntity } from '../../types';
import { burgersCollection } from '../connect';
import { ObjectId } from 'mongodb';
import { ValidateError } from '../../middlewares/handle-error';

export class BurgerRecord implements BurgerEntity {
    _id: ObjectId;
    name: string;
    ingredients: IngredientType[];
    price: number;
    img: string;

    constructor(obj: NewBurgerEntity) {
        this.name = obj.name;
        this.ingredients = obj.ingredients;
        this.price = obj.price;
        this.img = obj.img;
    }

    async add(): Promise<BurgerEntity['_id']> {
        const { insertedId } = await burgersCollection.insertOne({
            name: String(this.name),
            ingredients: this.ingredients,
            price: Number(this.price),
            img: String(this.img),
        });

        this._id = insertedId;
        return insertedId;
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Coupon id is invalid.');
        await burgersCollection.deleteOne({ _id: new ObjectId(id) });
    }

    async update(): Promise<void> {
        if (typeof this.name !== 'string') throw new ValidateError('Typeof name must be a string');
        if (typeof this.price !== 'number') throw new ValidateError('Typeof price must be a number');
        if (typeof this.img !== 'string') throw new ValidateError('Typeof img must be a string');

        await burgersCollection.replaceOne(
            { _id: this._id },
            {
                name: this.name,
                ingredients: this.ingredients,
                price: this.price,
                img: this.img,
            }
        );
    }

    static async getOne(id: string): Promise<BurgerEntity> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Burger id is invalid.');

        const item = (await burgersCollection.findOne({
            _id: new ObjectId(id),
        })) as BurgerEntity;

        if (!item) throw new ValidateError('In database dont have burger with given id.');

        return new BurgerRecord(item);
    }

    static async getAll(): Promise<BurgerEntity[]> {
        const result = await burgersCollection.find();
        const resultArray = (await result.toArray()) as BurgerEntity[];

        if (!resultArray.length) throw new ValidateError('In database dont have any burgers.');

        return resultArray;
    }
}
