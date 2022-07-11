import { IngredientEntity } from './ingredient-entity';

export enum MeatPreparation {
    RARE = 'rare',
    MEDIUM = 'medium',
    WELL_DONE = 'well done',
}

export interface BasketEntity {
    id: string;
    burgerId: string;
    name: string;
    price: number;
    burgerQuantity: number;
    extraIngredients: IngredientEntity[];
    totalValue: number;
    meatPreparation: MeatPreparation | null;
}
