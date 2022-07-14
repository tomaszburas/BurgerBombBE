import { InfoEntity, NewInfoEntity } from '../../types';
import { infoCollection } from '../connect';
import { ObjectId } from 'mongodb';
import { ValidationError } from '../../middlewares/handle-error';
import { validationEmail } from '../../utils/validation-email';

export class InfoRecord implements InfoEntity {
    id: string;
    street: string;
    number: string;
    zipCode: string;
    city: string;
    phone: string;
    email: string;
    monThu: { from: string; to: string };
    friSat: { from: string; to: string };
    sun: { from: string; to: string };
    orderNumber: number;

    constructor(obj: NewInfoEntity) {
        this.id = obj.id;
        this.street = obj.street;
        this.number = obj.number;
        this.zipCode = obj.zipCode;
        this.city = obj.city;
        this.phone = obj.phone;
        this.email = obj.email;
        this.monThu = obj.monThu;
        this.friSat = obj.friSat;
        this.sun = obj.sun;
        this.orderNumber = obj.orderNumber || 1;
    }

    private valid() {
        if (this.street.length <= 3 || this.street.length > 30)
            throw new ValidationError('Street name must by greater than 3 characters and less than 30 characters');
        if (this.number.length <= 0 || this.number.length > 10)
            throw new ValidationError('Number must by greater than 0 characters and less than 10 characters');
        if (this.zipCode.length <= 3 || this.zipCode.length > 10)
            throw new ValidationError('Zip Code by greater than 3 characters and less than 15 characters');
        if (this.city.length < 2 || this.city.length > 20)
            throw new ValidationError('City name must by greater than 3 characters and less than 20 characters');
        if (this.phone.length <= 5 || this.phone.length > 15)
            throw new ValidationError('Phone must by greater than 5 characters and less than 15 characters');
        if (!validationEmail(this.email)) throw new ValidationError('Incorrect email');
    }

    async save(): Promise<void> {
        this.valid();
        await infoCollection.updateOne(
            { _id: new ObjectId(this.id) },
            {
                $set: {
                    street: String(this.street),
                    number: String(this.number),
                    zipCode: String(this.zipCode),
                    city: String(this.city),
                    phone: String(this.phone),
                    email: String(this.email),
                    monThu: this.monThu,
                    friSat: this.friSat,
                    sun: this.sun,
                    orderNumber: this.orderNumber,
                },
            }
        );
    }

    static async get(): Promise<InfoRecord | null> {
        let item = (await infoCollection.findOne()) as NewInfoEntity;

        if (!item) {
            const { insertedId } = await infoCollection.insertOne({
                street: 'null',
                number: 'null',
                zipCode: 'null',
                city: 'null',
                phone: 'null',
                email: 'null',
                monThu: {
                    from: 'null',
                    to: 'null',
                },
                friSat: {
                    from: 'null',
                    to: 'null',
                },
                sun: {
                    from: 'null',
                    to: 'null',
                },
                orderNumber: 1,
            });

            item = (await infoCollection.findOne({ _id: insertedId })) as NewInfoEntity;
            return new InfoRecord(item);
        }

        item.id = item._id.toString();
        return new InfoRecord(item);
    }

    static async getOrderNumber(): Promise<number> {
        const item = await this.get();
        return item.orderNumber;
    }

    static async incOrderNumber(): Promise<void> {
        const item = await this.get();
        await infoCollection.updateOne(
            { _id: new ObjectId(item.id) },
            {
                $inc: {
                    orderNumber: 1,
                },
            }
        );
    }
}
