import { Response, Request } from 'express';
import { InfoRecord } from '../db/records/info-record';
import { ValidationError } from '../middlewares/handle-error';

export class InfoController {
    static async save(req: Request, res: Response) {
        const { street, number, zipCode, city, phone, email, monThu, friSat, sun } = req.body;

        const info = await InfoRecord.get();
        if (info === null) throw new ValidationError('There is no data in the database');

        info.street = street;
        info.number = number;
        info.zipCode = zipCode;
        info.city = city;
        info.phone = phone;
        info.email = email;
        info.monThu = {
            from: monThu.from,
            to: monThu.to,
        };
        info.friSat = {
            from: friSat.from,
            to: friSat.to,
        };
        info.sun = {
            from: sun.from,
            to: sun.to,
        };

        await info.save();

        res.status(200).json({
            success: true,
            message: 'Info updated successfully',
            info,
        });
    }

    static async get(req: Request, res: Response) {
        const info = await InfoRecord.get();

        res.status(200).json({
            success: true,
            info,
        });
    }
}
