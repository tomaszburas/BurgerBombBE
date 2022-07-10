import { Request, Response } from 'express';
import { OrderRecord } from '../db/records/order-record';
import { CouponRecord } from '../db/records/coupon-record';
import { orderValue } from '../utils/new-order';

export class OrderController {
    static async add(req: Request, res: Response) {
        const { client, order, coupon } = req.body;

        const value = await orderValue(order, coupon.id);

        // const newOrder = new OrderRecord({
        //     client: {
        //         firstName: client.firstName,
        //         lastName: client.lastName,
        //         street: client.street,
        //         number: client.number,
        //         zipCode: client.zipCode,
        //         city: client.city,
        //         phone: client.phone,
        //         email: client.email,
        //         accRules: client.accRules,
        //     },
        //     order,
        //     paymentMethod,
        //     coupon: coupon ? coupon : null,
        //     status: OrderStatus.NEW,
        // });
        //
        // await newOrder.add();

        res.status(201).json({
            success: true,
        });
    }

    static async updateStatus(req: Request, res: Response) {
        const { status } = req.body;
        const id = req.params.id;
        await OrderRecord.updateStatus(id, status);

        res.status(200).json({
            success: true,
        });
    }

    static async delete(req: Request, res: Response) {
        const id = req.params.id;
        await OrderRecord.delete(id);

        res.status(200).json({
            success: true,
        });
    }

    static async getOne(req: Request, res: Response) {
        const id = req.params.id;
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
