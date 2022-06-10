import { ObjectId } from 'mongodb';

export const checkIngredients = (arr: []) => {
    if (!arr.length) return [];
    return arr.map((e) => new ObjectId(e));
};
