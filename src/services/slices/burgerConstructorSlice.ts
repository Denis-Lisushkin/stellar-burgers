import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    getBun: (state: TBurgerConstructorState) => state.bun,
    getIngredients: (state: TBurgerConstructorState) => state.ingredients,
    getConstructorItems: createSelector(
      [
        (state: TBurgerConstructorState) => state.bun,
        (state: TBurgerConstructorState) => state.ingredients
      ],
      (bun, ingredients) => ({ bun, ingredients })
    ),
    getTotalPrice: createSelector(
      [
        (state: TBurgerConstructorState) => state.bun,
        (state: TBurgerConstructorState) => state.ingredients
      ],
      (bun: TIngredient | null, ingredients: TConstructorIngredient[]) => {
        const bunPrice = bun ? bun.price * 2 : 0;
        const ingredientsPrice = ingredients.reduce(
          (sum: number, ingredient: TConstructorIngredient) =>
            sum + ingredient.price,
          0
        );
        return bunPrice + ingredientsPrice;
      }
    )
  },
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: crypto.randomUUID()
          }
        };
      }
    },
    removeIngredient: (
      state: TBurgerConstructorState,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    },
    moveIngredient: (
      state: TBurgerConstructorState,
      action: PayloadAction<{ position: number; direction: 'Up' | 'Down' }>
    ) => {
      const { position, direction } = action.payload;
      const ingredients = [...state.ingredients];
      if (direction === 'Up' && position > 0) {
        [ingredients[position - 1], ingredients[position]] = [
          ingredients[position],
          ingredients[position - 1]
        ];
      } else if (direction === 'Down' && position < ingredients.length - 1) {
        [ingredients[position + 1], ingredients[position]] = [
          ingredients[position],
          ingredients[position + 1]
        ];
      }
      state.ingredients = ingredients;
    },
    clearConstructor: (state: TBurgerConstructorState) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const { getBun, getIngredients, getTotalPrice, getConstructorItems } =
  burgerConstructorSlice.selectors;
