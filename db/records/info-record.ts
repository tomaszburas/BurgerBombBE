import { InfoEntity, InfoEntityDB, NewInfoEntity } from '../../types';
import { informationsCollection } from '../connect';
import { ObjectId } from 'mongodb';

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
    }

    async add(): Promise<string> {
        const { insertedId } = await informationsCollection.insertOne({
            street: String(this.street),
            number: String(this.number),
            zipCode: String(this.zipCode),
            city: String(this.city),
            phone: String(this.phone),
            email: String(this.email),
            monThu: String(this.monThu),
            friSat: String(this.friSat),
            sun: String(this.sun),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    async update(obj: NewInfoEntity): Promise<InfoEntity> {
        const info = {
            street: obj.street ? String(obj.street) : this.street,
            number: obj.number ? String(obj.number) : this.number,
            zipCode: obj.zipCode ? String(obj.zipCode) : this.zipCode,
            city: obj.city ? String(obj.city) : this.city,
            phone: obj.phone ? String(obj.phone) : this.phone,
            email: obj.email ? String(obj.email) : this.email,
            monThu: obj.monThu ? obj.monThu : this.monThu,
            friSat: obj.friSat ? obj.friSat : this.friSat,
            sun: obj.sun ? obj.sun : this.sun,
        };

        await informationsCollection.replaceOne(
            { _id: new ObjectId(this.id) },
            {
                ...info,
            }
        );

        return new InfoRecord({ id: this.id, ...info });
    }

    static async get(): Promise<InfoEntity | null> {
        const item = (await informationsCollection.findOne()) as InfoEntityDB;

        return !item
            ? null
            : new InfoRecord({
                  id: item._id.toString(),
                  street: item.street,
                  number: item.number,
                  zipCode: item.zipCode,
                  city: item.city,
                  phone: item.phone,
                  email: item.email,
                  monThu: item.monThu,
                  friSat: item.friSat,
                  sun: item.sun,
              });
    }
}
