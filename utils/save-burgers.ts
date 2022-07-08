import { burgersCollection } from '../db/connect';
import { ObjectId } from 'mongodb';
import { BurgerRecord } from '../db/records/burger-record';

export const saveBurgers = async (burgers: BurgerRecord[]) => {
    return await Promise.all(
        burgers.map((burger) =>
            burgersCollection.updateOne(
                { _id: new ObjectId(burger.id) },
                {
                    $set: {
                        name: burger.name,
                        ingredients: burger.ingredients,
                        price: burger.price,
                        active: burger.active,
                        img: burger.img,
                    },
                }
            )
        )
    );
};
