import { BurgerEntity, BurgerEntityDB, NewBurgerEntity } from '../../types';
import { burgersCollection } from '../connect';
import { ObjectId } from 'mongodb';
import { ValidateError } from '../../middlewares/handle-error';

export class BurgerRecord implements BurgerEntity {
    id: string;
    name: string;
    ingredients: string[];
    price: number;
    img: string;

    constructor(obj: NewBurgerEntity) {
        this.id = obj.id;
        this.name = obj.name;
        this.ingredients = obj.ingredients;
        this.price = obj.price;
        this.img = obj.img;
    }

    async add(): Promise<string> {
        if (!this.name) throw new ValidateError('The name of burger is missing');
        if (this.ingredients.length < 3) throw new ValidateError('Count ingredients must be greater than 3');
        if (this.price <= 0) throw new ValidateError('Burger price must be greater than 0');
        if (!this.img) throw new ValidateError('The img of burger is missing');

        const { insertedId } = await burgersCollection.insertOne({
            name: String(this.name.toLowerCase()),
            ingredients: this.ingredients,
            price: Number(this.price),
            img: String(this.img),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Burger id is invalid');
        await burgersCollection.deleteOne({ _id: new ObjectId(id) });
    }

    async update({ name, ingredients, price, img }: NewBurgerEntity): Promise<void> {
        await burgersCollection.replaceOne(
            { _id: new ObjectId(this.id) },
            {
                name: name ? String(name.toLowerCase()) : this.name,
                ingredients: ingredients.length >= 3 ? ingredients : this.ingredients,
                price: price ? Number(price) : this.price,
                img: img ? String(img) : this.img,
            }
        );
    }

    static async getOne(id: string): Promise<BurgerEntity> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Burger id is invalid');

        const item = (await burgersCollection.findOne({
            _id: new ObjectId(id),
        })) as BurgerEntityDB;

        if (!item) throw new ValidateError('In database dont have burger with given id');

        item.id = item._id.toString();

        return new BurgerRecord(item);
    }

    static async getAll(): Promise<BurgerEntity[]> {
        const cursor = await burgersCollection.find().sort({ name: 1 });
        const burgers = await cursor.toArray();

        return burgers.length === 0
            ? []
            : burgers.map((burger: BurgerEntityDB) => ({
                  id: burger._id.toString(),
                  name: burger.name,
                  ingredients: burger.ingredients,
                  price: burger.price,
                  img: burger.img,
              }));
    }
}
