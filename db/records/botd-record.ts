import { BotdEntity, BotdEntityDB, NewBotdEntity } from '../../types/entity/botd-entity';
import { BurgerRecord } from './burger-record';
import { ObjectId } from 'mongodb';
import { botdCollection } from '../connect';

export class BotdRecord implements BotdEntity {
    id: string;
    burger: BurgerRecord;

    constructor(obj: NewBotdEntity) {
        this.id = obj.id;
        this.burger = obj.burger;
    }

    static async get(): Promise<BotdRecord> {
        let botd = (await botdCollection.findOne()) as BotdEntityDB;

        if (!botd) {
            const { insertedId } = await botdCollection.insertOne({
                burger: false,
            });

            botd = (await botdCollection.findOne({ _id: insertedId })) as BotdEntityDB;
            return new BotdRecord(botd);
        }

        botd.id = botd._id.toString();
        return new BotdRecord(botd);
    }

    async save(): Promise<void> {
        await botdCollection.updateOne(
            { _id: new ObjectId(this.id) },
            {
                $set: {
                    burger: this.burger,
                },
            }
        );
    }

    static async delete(): Promise<void> {
        const burgers = await BurgerRecord.getAll();

        if (burgers.length === 0) {
            const { id } = await this.get();
            await botdCollection.findOneAndDelete({ _id: new ObjectId(id) });
        }
    }

    static async updateBurger(burgers: BurgerRecord[]): Promise<void> {
        const botd = await this.get();

        if (botd.burger && burgers.length > 0) {
            botd.burger = burgers.find((burger) => botd.burger.id === burger.id);
            await botd.save();
        }
    }
}
