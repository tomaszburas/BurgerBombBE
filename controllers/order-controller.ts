import { Request, Response } from 'express';
import { OrderRecord } from '../db/records/order-record';
import { CouponRecord } from '../db/records/coupon-record';
import { ValidationError } from '../middlewares/handle-error';
import { orderValue } from '../utils/new-order';
import { OrderStatus } from '../types';

export class OrderController {
    static async add(req: Request, res: Response) {
        const { client, order } = req.body;

        const value = await orderValue(order);

        const newOrder = new OrderRecord({
            client: {
                firstName: client.firstName,
                lastName: client.lastName,
                address: {
                    street: client.address.street,
                    number: client.address.number,
                    zipCode: client.address.zipCode,
                    city: client.address.city,
                },
                phone: client.phone,
                email: client.email,
            },
            order: {
                burger: order.burger,
                extraIngredients: order.extraIngredients,
                price: value,
                payment: order.payment,
                coupon: order.coupon ? order.coupon : null,
            },
            status: OrderStatus.NEW,
        });

        await newOrder.add();

        res.status(201).json({
            success: true,
        });
    }

    static async updateStatus(req: Request, res: Response) {
        const { status } = req.body;
        const id = req.params.id;
        if (!id) throw new ValidationError('Incorrect order id.');

        await OrderRecord.updateStatus(id, status);

        res.status(200).json({
            success: true,
        });
    }

    static async delete(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidationError('Incorrect coupon id.');

        await OrderRecord.delete(id);

        res.status(200).json({
            success: true,
        });
    }

    static async getOne(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidationError('Incorrect coupon id.');

        const order = await OrderRecord.getOne(id);

        res.status(200).json({
            success: true,
            order,
        });
    }

    static async getAll(req: Request, res: Response) {
        const orders = await CouponRecord.getAll();

        res.status(200).json({
            success: true,
            orders,
        });
    }
}
