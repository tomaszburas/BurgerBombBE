import { CouponEntity, NewCouponEntity } from '../../types';
import { ObjectId } from 'mongodb';
import { couponsCollection } from '../connect';
import { ValidateError } from '../../middlewares/handle-error';

export class CouponRecord implements CouponEntity {
    _id: ObjectId;
    name: string;
    value: number;

    constructor(obj: NewCouponEntity) {
        this._id = obj._id;
        this.name = obj.name;
        this.value = obj.value;
    }

    async add(): Promise<null | CouponEntity['_id']> {
        const { insertedId } = await couponsCollection.insertOne({
            name: String(this.name),
            value: Number(this.value),
        });

        this._id = insertedId;
        return insertedId;
    }

    async update(): Promise<void> {
        if (typeof this.name !== 'string') throw new ValidateError('Typeof name must be a string');
        if (typeof this.value !== 'number') throw new ValidateError('Typeof value must be a number');

        await couponsCollection.replaceOne(
            { _id: this._id },
            {
                name: this.name,
                value: this.value,
            }
        );
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Coupon id is invalid.');
        await couponsCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getOne(id: string): Promise<CouponEntity> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Coupon id is invalid.');

        const item = (await couponsCollection.findOne({ _id: new ObjectId(id) })) as CouponEntity;

        if (!item) throw new ValidateError('In database dont have coupon with given id.');

        return new CouponRecord(item);
    }

    static async getAll(): Promise<CouponEntity[]> {
        const result = await couponsCollection.find();
        const resultArray = (await result.toArray()) as CouponEntity[];

        if (!resultArray.length) throw new ValidateError('In database dont have any coupons.');

        return resultArray;
    }
}
