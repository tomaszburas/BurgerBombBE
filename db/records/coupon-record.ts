import { CouponEntity, CouponEntityDB, CouponEntityResponse, NewCouponEntity } from '../../types';
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

    private valid() {
        if (this.name.length <= 3 || this.name.length > 15)
            throw new ValidationError('Coupon name must by greater than 3 characters and less than 15 characters');
        if (this.value <= 0 || this.value > 100) throw new ValidationError('Coupon value must be between 1 and 100');
    }

    async add(): Promise<string> {
        this.valid();
        const { insertedId } = await couponsCollection.insertOne({
            name: String(this.name),
            value: Number(this.value),
        });

        this.id = insertedId.toString();
        return this.id;
    }

    async update(): Promise<void> {
        this.valid();
        await couponsCollection.updateOne(
            { _id: new ObjectId(this.id) },
            {
                $set: {
                    name: String(this.name),
                    value: Number(this.value),
                },
            }
        );
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidationError('Coupon id is invalid');
        await couponsCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getOne(id: string): Promise<CouponRecord> {
        if (!ObjectId.isValid(id)) throw new ValidationError('Coupon id is invalid');

        const coupon = (await couponsCollection.findOne({ _id: new ObjectId(id) })) as CouponEntityDB;

        if (!coupon) throw new ValidationError('In database dont have coupon with given id');

        coupon.id = coupon._id.toString();

        return new CouponRecord(coupon);
    }

    static async getAll(): Promise<CouponEntityResponse[]> {
        const cursor = await couponsCollection.find().sort({ name: 1 });
        const coupons = (await cursor.toArray()) as CouponEntityDB[];

        return coupons.length === 0
            ? []
            : coupons.map((coupon: CouponEntityDB) => ({
                  id: coupon._id.toString(),
                  name: coupon.name,
                  value: coupon.value,
              }));
    }

    static async getByName(name: string): Promise<CouponRecord> {
        const coupon = (await couponsCollection.findOne({ name })) as CouponEntityDB;

        if (!coupon) throw new ValidationError('Coupon does not exist');

        coupon.id = coupon._id.toString();

        return new CouponRecord(coupon);
    }
}
