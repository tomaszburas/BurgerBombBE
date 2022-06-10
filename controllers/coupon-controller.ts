import { Response, Request } from 'express';
import { CouponRecord } from '../db/records/coupon-record';
import { ValidateError } from '../middlewares/handle-error';

export class CouponController {
    static async add(req: Request, res: Response) {
        const { name, value } = req.body;

        const coupon = new CouponRecord({
            _id: null,
            name: String(name),
            value: Number(value),
        });

        await coupon.add();

        res.status(201).json({
            success: true,
        });
    }

    static async update(req: Request, res: Response) {
        const obj = req.body;
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect coupon id.');

        const coupon = await CouponRecord.getOne(id);

        if (obj.name) coupon.name = obj.name;
        if (obj.value) coupon.value = obj.value;

        await coupon.update();

        res.status(200).json({
            success: true,
        });
    }

    static async delete(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect coupon id.');

        await CouponRecord.delete(id);

        res.status(200).json({
            success: true,
        });
    }

    static async getOne(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect coupon id.');

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
