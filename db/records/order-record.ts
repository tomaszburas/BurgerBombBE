import { OrderType, OrderStatus, BurgerEntity, IngredientType, CouponEntity } from '../../types';
import { ObjectId } from 'mongodb';
import { ordersCollection } from '../connect';
import { ValidateError } from '../../middlewares/handle-error';

export class OrderRecord implements OrderType {
    _id: ObjectId | null;
    client: {
        fullName: string;
        address: string;
        phone: string;
        mail: string;
    };
    order: {
        burger: BurgerEntity['_id'];
        extraIngredients: IngredientType['_id'][] | [];
        price: number;
        coupon: CouponEntity['_id'] | null;
    };
    status: OrderStatus;

    constructor(obj: OrderType) {
        this._id = obj._id;
        this.client = obj.client;
        this.order = obj.order;
        this.status = obj.status || OrderStatus.NEW;
    }

    async add(): Promise<null | OrderType['_id']> {
        const { insertedId } = await ordersCollection.insertOne({
            client: this.client,
            order: this.order,
            status: this.status,
        });

        if (!insertedId) return null;
        this._id = insertedId;
        return insertedId;
    }

    static async updateStatus(id: string, status: OrderType['status']): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Order id is invalid.');

        await ordersCollection.updateOne(
            { _id: id },
            {
                $set: {
                    status,
                },
            }
        );
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidateError('Order id is invalid.');
        await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getOne(id: string): Promise<OrderType> {
        if (!ObjectId.isValid(id)) {
            throw new ValidateError('Order id is invalid.');
        }

        const item = (await ordersCollection.findOne({
            _id: new ObjectId(id),
        })) as OrderType;

        if (!item) throw new ValidateError('In database dont have ingredient with given id.');

        return new OrderRecord(item);
    }

    static async getAll(): Promise<OrderType[]> {
        const result = await ordersCollection.find();
        const resultArray = (await result.toArray()) as OrderType[];

        if (!resultArray.length) throw new ValidateError('Id database dont have any order.');

        return resultArray;
    }
}
