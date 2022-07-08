import { BurgerRecord } from '../../db/records/burger-record';
import { ObjectId } from 'mongodb';

export interface BotdEntity {
    id: string;
    burger: BurgerRecord;
}

export interface NewBotdEntity extends Omit<BotdEntity, 'id'> {
    id?: string;
}

export interface BotdEntityDB extends Omit<BotdEntity, 'id'> {
    _id: ObjectId;
    id?: string;
}
