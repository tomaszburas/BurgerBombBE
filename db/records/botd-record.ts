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
                burger: null,
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
}
