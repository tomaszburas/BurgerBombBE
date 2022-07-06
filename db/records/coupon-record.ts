import { CouponEntity, CouponEntityDB, NewCouponEntity } from '../../types';
import { ObjectId } from 'mongodb';
import { couponsCollection } from '../connect';
import { ValidationError } from '../../middlewares/handle-error';

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
        if (this.name === '') throw new ValidationError('Coupon name cannot be empty');
        if (this.value <= 0 || this.value > 100)
            throw new ValidationError('The coupon value must be between 1 and 100');

        const { insertedId } = await couponsCollection.insertOne({
            name: String(this.name),
            value: Number(this.value),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    async update({ name, value }: NewCouponEntity): Promise<CouponEntity> {
        const coupon = {
            name: name ? String(name) : this.name,
            value: value ? Number(value) : this.value,
        };

        await couponsCollection.replaceOne(
            { _id: new ObjectId(this.id) },
            {
                ...coupon,
            }
        );

        return new CouponRecord({ id: this.id, ...coupon });
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidationError('Coupon id is invalid');
        await couponsCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getOne(id: string): Promise<CouponEntity> {
        if (!ObjectId.isValid(id)) throw new ValidationError('Coupon id is invalid');

        const coupon = (await couponsCollection.findOne({ _id: new ObjectId(id) })) as CouponEntityDB;

        if (!coupon) throw new ValidationError('In database dont have coupon with given id');

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
