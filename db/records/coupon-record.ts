import { CouponEntity, CouponEntityDB, NewCouponEntity } from '../../types';
import { ObjectId } from 'mongodb';
import { couponsCollection } from '../connect';
import { ValidateError } from '../../middlewares/handle-error';

export class CouponRecord implements CouponEntity {
    id: string;
    name: string;
    value: number;

    constructor(obj: NewCouponEntity) {
        this.id = obj.id;
        this.name = obj.name;
        this.value = obj.value;
    }

    async add(): Promise<string> {
        if (this.name === '') throw new ValidateError('Coupon name cannot be empty');
        if (this.value <= 0 || this.value > 100) throw new ValidateError('The coupon value must be between 1 and 100');

        const { insertedId } = await couponsCollection.insertOne({
            name: String(this.name),
            value: Number(this.value),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    async update({ name, value }: NewCouponEntity): Promise<void> {
        await couponsCollection.replaceOne(
            { _id: new ObjectId(this.id) },
            {
                name: name ? String(name) : this.name,
                value: value ? Number(value) : this.value,
            }
        );
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Coupon id is invalid');
        await couponsCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getOne(id: string): Promise<CouponEntity> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Coupon id is invalid');

        const coupon = (await couponsCollection.findOne({ _id: new ObjectId(id) })) as CouponEntityDB;

        if (!coupon) throw new ValidateError('In database dont have coupon with given id');

        coupon.id = coupon._id.toString();

        return new CouponRecord(coupon);
    }

    static async getAll(): Promise<CouponEntity[]> {
        const cursor = await couponsCollection.find().sort({ name: -1 });
        const coupons = (await cursor.toArray()) as CouponEntityDB[];

        return coupons.length === 0
            ? []
            : coupons.map((coupon: CouponEntityDB) => ({
                  id: coupon._id.toString(),
                  name: coupon.name,
                  value: coupon.value,
              }));
    }
}
