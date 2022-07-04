import { IngredientRecord } from '../db/records/ingredient-record';

export const checkIngredients = async (arr: string[]): Promise<boolean> => {
    if (!arr.length) return false;

    const ingredients = await IngredientRecord.getAll();

    return arr.every((ingredient) => {
        const checkIng = ingredients.findIndex((el) => el.id === ingredient);
        return checkIng >= 0;
    });
};
