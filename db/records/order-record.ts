import {
    OrderEntity,
    OrderStatus,
    BurgerEntity,
    IngredientEntity,
    CouponEntity,
    NewOrderEntity,
    PaymentMethod,
} from '../../types';
import { ObjectId } from 'mongodb';
import { ordersCollection } from '../connect';
import { ValidateError } from '../../middlewares/handle-error';

export class OrderRecord implements OrderEntity {
    _id: ObjectId;
    client: {
        firstName: string;
        lastName: string;
        address: {
            street: string;
            number: string;
            zipCode: string;
            city: string;
        };
        phone: string;
        email: string;
    };
    order: {
        burger: BurgerEntity['_id'];
        extraIngredients: IngredientEntity['_id'][] | [];
        price: number;
        coupon: CouponEntity['_id'] | null;
        payment: {
            method: PaymentMethod;
        };
    };
    status: OrderStatus;

    constructor(obj: NewOrderEntity) {
        this._id = obj._id;
        this.client = obj.client;
        this.order = obj.order;
        this.status = obj.status || OrderStatus.NEW;
    }

    async add(): Promise<null | OrderEntity['_id']> {
        const { insertedId } = await ordersCollection.insertOne({
            client: this.client,
            order: this.order,
            status: this.status,
        });

        if (!insertedId) return null;
        this._id = insertedId;
        return insertedId;
    }

    static async updateStatus(id: string, status: OrderEntity['status']): Promise<void> {
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

    static async getOne(id: string): Promise<OrderEntity> {
        if (!ObjectId.isValid(id)) {
            throw new ValidateError('Order id is invalid.');
        }

        const item = (await ordersCollection.findOne({
            _id: new ObjectId(id),
        })) as OrderEntity;

        if (!item) throw new ValidateError('In database dont have ingredient with given id.');

        return new OrderRecord(item);
    }

    static async getAll(): Promise<OrderEntity[]> {
        const result = await ordersCollection.find();
        const resultArray = (await result.toArray()) as OrderEntity[];

        if (!resultArray.length) throw new ValidateError('Id database dont have any order.');

        return resultArray;
    }
}
