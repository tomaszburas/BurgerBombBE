import { BasketEntity, CouponEntity, IngredientEntity } from '../types';
import { BurgerRecord } from '../db/records/burger-record';
import { IngredientRecord } from '../db/records/ingredient-record';
import { round } from './round';
import { CouponRecord } from '../db/records/coupon-record';

export const orderValue = async (order: BasketEntity[], coupon: CouponEntity): Promise<number> => {
    if (order.length === 0) return 0;
    let totalValue = 0;

    const burgers = await Promise.all(order.map((burger) => BurgerRecord.getOne(burger.burgerId)));

    const ingredientsPromises = order.map((burger) => {
        return burger.extraIngredients.map((ingredient) => IngredientRecord.getOne(ingredient.id));
    });
    const ingredients: any[] = [];
    for (const ing of ingredientsPromises) {
        ingredients.push(await Promise.all(ing));
    }

    order.map(({ burgerQuantity }, index) => {
        let ingredientValue = 0;

        if (ingredients[index].length > 0) {
            ingredientValue = ingredients[index].reduce((prev: number, curr: IngredientEntity) => prev + curr.price, 0);
        }

        totalValue += round(burgerQuantity * (burgers[index].price + ingredientValue));
    });

    if (coupon) {
        const couponValue = (await CouponRecord.getOne(coupon.id)).value;
        totalValue = round(totalValue * (1 - couponValue / 100));
    }

    return totalValue;
};
