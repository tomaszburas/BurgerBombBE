import { OrderEntity, OrderStatus, NewOrderEntity, PaymentMethod, BasketEntity, CouponEntity } from '../../types';
import { ObjectId } from 'mongodb';
import { ordersCollection } from '../connect';
import { ValidationError } from '../../middlewares/handle-error';
import { validationEmail } from '../../utils/validation-email';

export class OrderRecord implements OrderEntity {
    id: string;
    client: {
        firstName: string;
        lastName: string;
        street: string;
        number: string;
        zipCode: string;
        city: string;
        phone: string;
        email: string;
        accRules: boolean;
    };
    order: BasketEntity[];
    coupon: CouponEntity | null;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    orderNumber: number;
    value: number;
    date: Date;

    constructor(obj: NewOrderEntity) {
        this.id = obj.id;
        this.client = obj.client;
        this.order = obj.order;
        this.status = obj.status || OrderStatus.NEW;
        this.coupon = obj.coupon || null;
        this.paymentMethod = obj.paymentMethod;
        this.value = obj.value;
        this.orderNumber = obj.orderNumber;
        this.date = obj.date;
    }

    valid() {
        if (this.client.firstName.length < 3 || this.client.firstName.length > 15)
            throw new ValidationError('First name must by greater than 3 characters and less than 15 characters');
        if (this.client.lastName.length < 3 || this.client.lastName.length > 15)
            throw new ValidationError('Last name must by greater than 3 characters and less than 15 characters');
        if (this.client.street.length < 3 || this.client.street.length > 15)
            throw new ValidationError('Street name must by greater than 3 characters and less than 15 characters');
        if (this.client.number.length <= 0 || this.client.number.length > 10)
            throw new ValidationError('Number must by greater than 0 characters and less than 10 characters');
        if (this.client.zipCode.length < 3 || this.client.zipCode.length > 10)
            throw new ValidationError('Zip Code by greater than 3 characters and less than 15 characters');
        if (this.client.city.length < 3 || this.client.city.length > 20)
            throw new ValidationError('City name must by greater than 3 characters and less than 20 characters');
        if (this.client.phone.length < 5 || this.client.phone.length > 15)
            throw new ValidationError('Phone must by greater than 5 characters and less than 15 characters');
        if (!validationEmail(this.client.email)) throw new ValidationError('Incorrect email');
        if (!this.client.accRules) throw new ValidationError('Please accept the regulations');
        if (this.order.length === 0) throw new ValidationError('Basket is empty');
        if (this.paymentMethod.length === 0) throw new ValidationError('Please choose a payment method');
    }

    async add(): Promise<string> {
        this.valid();
        const { insertedId } = await ordersCollection.insertOne({
            client: this.client,
            order: this.order,
            coupon: this.coupon,
            status: this.status,
            paymentMethod: this.paymentMethod,
            value: this.value,
            orderNumber: this.orderNumber,
            date: this.date,
        });

        this.id = insertedId.toString();
        return this.id;
    }

    static async updateStatus(id: string, status: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidationError('Order id is invalid');
        await ordersCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status,
                },
            }
        );
    }

    static async delete(id: string): Promise<void> {
        if (!ObjectId.isValid(id)) throw new ValidationError('Order id is invalid');
        await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    }

    static async getOne(id: string): Promise<OrderEntity> {
        if (!ObjectId.isValid(id)) {
            throw new ValidationError('Order id is invalid');
        }

        const item = (await ordersCollection.findOne({
            _id: new ObjectId(id),
        })) as NewOrderEntity;

        if (!item) throw new ValidationError('In database dont have order with given id');

        item.id = item._id.toString();

        return new OrderRecord(item);
    }

    static async getAll(): Promise<OrderEntity[]> {
        const cursor = await ordersCollection.find().sort({ orderNumber: -1 });
        const orders = (await cursor.toArray()) as NewOrderEntity[];

        if (!orders.length) throw new ValidationError('Id database dont have any order.');

        return orders.length === 0
            ? []
            : orders.map((order: NewOrderEntity) => ({
                  id: order._id.toString(),
                  client: order.client,
                  order: order.order,
                  coupon: order.coupon,
                  status: order.status,
                  paymentMethod: order.paymentMethod,
                  value: order.value,
                  orderNumber: order.orderNumber,
                  date: order.date,
              }));
    }
}
