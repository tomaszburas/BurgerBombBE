import { BurgerRecord } from '../db/records/burger-record';
import { IngredientRecord } from '../db/records/ingredient-record';
import { CouponRecord } from '../db/records/coupon-record';

export const orderValue = async (order: any): Promise<number> => {
    const burgerPrice = (await BurgerRecord.getOne(order.burger)).price;
    let ingredientsPrice = 0;
    let couponValue = 0;

    if (order.extraIngredients.length) {
        for (const id of order.extraIngredients) {
            ingredientsPrice += (await IngredientRecord.getOne(id)).price;
        }
    }

    if (order.coupon) {
        couponValue = (await CouponRecord.getOne(order.coupon)).value;
    }

    return burgerPrice + ingredientsPrice + couponValue;
};
