import { BotdEntity, NewBotdEntity } from '../../types/entity/botd-entity';
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
        let botd = (await botdCollection.findOne()) as NewBotdEntity;

        if (!botd) {
            const { insertedId } = await botdCollection.insertOne({
                burger: false,
            });

            botd = (await botdCollection.findOne({ _id: insertedId })) as NewBotdEntity;
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

    static async updateBurger(burgers: BurgerRecord[]): Promise<void> {
        const botd = await this.get();

        if (botd.burger) {
            burgers.map((burger) => {
                if (burger.id === botd.burger.id) {
                    botd.burger = burger;
                }
            });
            await botd.save();
        }
    }

    static async deleteBurger(id: string): Promise<void> {
        const botd = await this.get();

        if (botd.burger && botd.burger.id === id) {
            botd.burger = null;
            await botd.save();
        }
    }
}
