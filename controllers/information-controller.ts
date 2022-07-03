import { Response, Request } from 'express';
import { InformationRecord } from '../db/records/information-record';
import { ValidateError } from '../middlewares/handle-error';

export class InformationController {
    static async add(req: Request, res: Response) {
        const { street, number, zipCode, city, phone, email, monThu, friSat, sun } = req.body;

        const info = new InformationRecord({
            street,
            number,
            zipCode,
            city,
            phone,
            email,
            monThu: {
                from: monThu.from,
                to: monThu.to,
            },
            friSat: {
                from: friSat.from,
                to: friSat.to,
            },
            sun: {
                from: sun.from,
                to: sun.to,
            },
        });

        await info.add();

        res.status(201).json({
            success: true,
            message: 'Information added successfully',
        });
    }

    static async update(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) throw new ValidateError('Incorrect info id');

        const info = await InformationRecord.get();

        const newInfo = {
            street: req.body.street ? req.body.street : '',
            number: req.body.number ? req.body.number : '',
            zipCode: req.body.zipCode ? req.body.zipCode : '',
            city: req.body.city ? req.body.city : '',
            phone: req.body.phone ? req.body.phone : '',
            email: req.body.email ? req.body.email : '',
            monThu: {
                from: req.body.monThu.from ? req.body.monThu.from : '',
                to: req.body.monThu.to ? req.body.monThu.to : '',
            },
            friSat: {
                from: req.body.friSat.from ? req.body.friSat.from : '',
                to: req.body.friSat.to ? req.body.friSat.to : '',
            },
            sun: {
                from: req.body.sun.from ? req.body.sun.from : '',
                to: req.body.sun.to ? req.body.sun.to : '',
            },
        };

        const newInfoEntity = new InformationRecord({
            id,
            street: info.street,
            number: info.number,
            zipCode: info.zipCode,
            city: info.city,
            phone: info.phone,
            email: info.email,
            monThu: {
                from: info.monThu.from,
                to: info.monThu.to,
            },
            friSat: {
                from: info.friSat.from,
                to: info.friSat.to,
            },
            sun: {
                from: info.sun.from,
                to: info.sun.to,
            },
        });

        await newInfoEntity.update(newInfo);

        res.status(200).json({
            success: true,
            message: 'Info update successfully',
        });
    }

    static async get(req: Request, res: Response) {
        const info = await InformationRecord.get();

        res.status(200).json({
            success: true,
            info,
        });
    }
}
