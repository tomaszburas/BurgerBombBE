import { OrderEntity, OrderStatus, NewOrderEntity, PaymentMethod } from '../../types';
import { ObjectId } from 'mongodb';
import { ordersCollection } from '../connect';
import { ValidateError } from '../../middlewares/handle-error';

export class OrderRecord implements OrderEntity {
    id: string;
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
        burger: string;
        extraIngredients: string[];
        price: number;
        coupon: string | null;
        payment: {
            method: PaymentMethod;
        };
    };
    status: OrderStatus;

    constructor(obj: NewOrderEntity) {
        this.id = obj.id;
        this.client = obj.client;
        this.order = obj.order;
        this.status = obj.status || OrderStatus.NEW;
    }

    async add(): Promise<null | string> {
        const { insertedId } = await ordersCollection.insertOne({
            client: this.client,
            order: this.order,
            status: this.status,
        });

        if (!insertedId) return null;
        this.id = insertedId.toString();
        return this.id;
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
        })) as any;

        if (!item) throw new ValidateError('In database dont have ingredient with given id.');

        return new OrderRecord(item);
    }

    static async getAll(): Promise<OrderEntity[]> {
        const result = await ordersCollection.find();
        const resultArray = (await result.toArray()) as any[];

        if (!resultArray.length) throw new ValidateError('Id database dont have any order.');

        return resultArray;
    }
}
