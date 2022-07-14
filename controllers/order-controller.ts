import { Request, Response } from 'express';
import { OrderRecord } from '../db/records/order-record';
import { OrderStatus } from '../types';
import { orderValue } from '../utils/new-order';
import { InfoRecord } from '../db/records/info-record';
import { checkPermissions } from '../utils/check-permissions';

export class OrderController {
    static async add(req: Request, res: Response) {
        const { client, order, coupon } = req.body;

        const newOrder = new OrderRecord({
            client: {
                firstName: client.firstName.trim(),
                lastName: client.lastName.trim(),
                street: client.street.trim(),
                number: client.number.trim(),
                zipCode: client.zipCode.trim(),
                city: client.city.trim(),
                phone: client.phone.trim(),
                email: client.email.trim(),
                accRules: client.accRules,
            },
            order,
            paymentMethod: client.paymentMethod,
            coupon: coupon ? coupon : null,
            status: OrderStatus.NEW,
            value: await orderValue(order, coupon),
            orderNumber: await InfoRecord.getOrderNumber(),
            date: new Date(),
        });

        await newOrder.add();

        res.status(201).json({
            success: true,
            order: newOrder,
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
        checkPermissions(req.user.role);
        const id = req.params.id;
        await OrderRecord.delete(id);

        res.status(200).json({
            success: true,
            message: 'Order removed',
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
        const orders = await OrderRecord.getAll();

        res.status(200).json({
            success: true,
            orders,
        });
    }
}
