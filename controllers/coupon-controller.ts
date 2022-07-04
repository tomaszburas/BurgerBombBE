import { Response, Request } from 'express';
import { CouponRecord } from '../db/records/coupon-record';
import { ValidateError } from '../middlewares/handle-error';
import { Role } from '../types';

export class CouponController {
    static async add(req: Request, res: Response) {
        const { name, value } = req.body;

        const coupon = new CouponRecord({
            name: String(name),
            value: Number(value),
        });

        await coupon.add();

        res.status(201).json({
            success: true,
        });
    }

    static async update(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect coupon id');

        const coupon = await CouponRecord.getOne(id);

        const newCoupon = {
            name: req.body.name ? req.body.name : '',
            value: req.body.value ? req.body.value : 0,
        };

        const newCouponEntity = new CouponRecord({
            id,
            name: coupon.name,
            value: coupon.value,
        });

        await newCouponEntity.update(newCoupon);

        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
        });
    }

    static async delete(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect coupon id');

        await CouponRecord.delete(id);

        res.status(200).json({
            success: true,
        });
    }

    static async getOne(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect coupon id');

        const coupon = await CouponRecord.getOne(id);

        res.status(200).json({
            success: true,
            coupon,
        });
    }

    static async getAll(req: Request, res: Response) {
        const coupons = await CouponRecord.getAll();

        res.status(200).json({
            success: true,
            coupons,
        });
    }
}
