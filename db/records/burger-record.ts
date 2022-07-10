import { BurgerEntity, BurgerEntityDB, BurgerIngredient, IngredientEntity, NewBurgerEntity } from '../../types';
import { burgersCollection } from '../connect';
import { ObjectId } from 'mongodb';
import { ValidationError } from '../../middlewares/handle-error';
import { saveBurgers } from '../../utils/save-burgers';
import { promises as fs } from 'fs';
import path from 'path';
import { BotdRecord } from './botd-record';
import { round } from '../../utils/round';

export class BurgerRecord implements BurgerEntity {
    id: string;
    name: string;
    ingredients: BurgerIngredient[];
    price: number;
    active: boolean;
    img: string;

    constructor(obj: NewBurgerEntity) {
        this.id = obj.id;
        this.name = obj.name;
        this.ingredients = obj.ingredients;
        this.price = round(obj.price);
        this.active = obj.active;
        this.img = obj.img;
    }

    private valid() {
        if (this.name.length < 3 || this.name.length > 15) {
            fs.unlink(path.join(__dirname, '../../public', 'images', this.img));
            throw new ValidationError('The burger name must be more than 3 letters and less than 15 characters');
        }
        if (this.ingredients.length < 3) {
            fs.unlink(path.join(__dirname, '../../public', 'images', this.img));
            throw new ValidationError('Count ingredients must be greater than 3');
        }
        if (this.price <= 0) {
            fs.unlink(path.join(__dirname, '../../public', 'images', this.img));
            throw new ValidationError('Burger price must be greater than 0');
        }
        if (!this.img) {
            throw new ValidationError('The img of burger is missing');
        }
    }

    async add(): Promise<string> {
        this.valid();
        const { insertedId } = await burgersCollection.insertOne({
            name: String(this.name.toLowerCase()),
            ingredients: this.ingredients,
            price: Number(this.price),
            active: Boolean(this.active),
            img: String(this.img),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidationError('Burger id is invalid');
        await burgersCollection.deleteOne({ _id: new ObjectId(id) });
    }

    async update(): Promise<void> {
        this.valid();
        await burgersCollection.updateOne(
            { _id: new ObjectId(this.id) },
            {
                $set: {
                    name: String(this.name.toLowerCase()),
                    price: Number(this.price),
                    ingredients: this.ingredients,
                    active: Boolean(this.active),
                    img: String(this.img),
                },
            }
        );
    }

    static async updateIngredient(id: string, name: string): Promise<BurgerRecord[]> {
        const burgers = await this.getAll();

        const burgersUpdated = burgers.map((burger) => {
            burger.ingredients.map((ingredient: IngredientEntity) => {
                if (ingredient.id === id) {
                    ingredient.name = String(name).toLowerCase();
                }
            });
            return burger;
        });

        const res = await saveBurgers(burgersUpdated);
        await BotdRecord.updateBurger(burgersUpdated);

        return res.length === 0 ? [] : burgersUpdated.map((burger) => new BurgerRecord(burger));
    }

    static async deleteIngredient(id: string): Promise<BurgerRecord[]> {
        const burgers = await this.getAll();

        const burgersUpdated = burgers.map((burger) => {
            const ingredients = burger.ingredients.filter((ingredient: IngredientEntity) => {
                if (ingredient.id === id) {
                    throw new ValidationError(
                        'You cannot delete the selected ingredient. It is a component of the burger'
                    );
                }
                return ingredient.id !== id;
            });
            return {
                ...burger,
                ingredients: ingredients,
            };
        }) as BurgerRecord[];

        const res = await saveBurgers(burgersUpdated);
        await BotdRecord.updateBurger(burgersUpdated);

        return res.length === 0 ? [] : burgersUpdated.map((burger) => new BurgerRecord(burger));
    }

    static async getOne(id: string): Promise<BurgerRecord> {
        if (!ObjectId.isValid(id)) throw new ValidationError('Burger id is invalid');

        const item = (await burgersCollection.findOne({
            _id: new ObjectId(id),
        })) as BurgerEntityDB;

        if (!item) throw new ValidationError('In database dont have burger with given id');

        item.id = item._id.toString();

        return new BurgerRecord(item);
    }

    static async getAll(): Promise<BurgerRecord[]> {
        const cursor = await burgersCollection.find().sort({ name: 1 });
        const burgers = (await cursor.toArray()) as any;

        return burgers.length === 0
            ? []
            : burgers.map((burger: BurgerEntityDB) => ({
                  id: burger._id.toString(),
                  name: burger.name,
                  ingredients: burger.ingredients,
                  price: burger.price,
                  active: burger.active,
                  img: burger.img,
              }));
    }

    static async updateActive(id: string, active: boolean): Promise<void> {
        await burgersCollection.findOneAndUpdate(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    active: Boolean(active),
                },
            }
        );
    }
}
