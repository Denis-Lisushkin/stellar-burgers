import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  clearConstructor,
  initialState,
  TBurgerConstructorState
} from '../services/slices/burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('burgerConstructorSlice', () => {
  let state: TBurgerConstructorState;

  const bun: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const ingredient1: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const ingredient2: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 100,
    price: 50,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  };

  beforeEach(() => {
    state = { ...initialState };
  });

  it('должен вернуть initialState по умолчанию', () => {
    expect(burgerConstructorReducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  it('Тест добавления булки', () => {
    const newState = burgerConstructorReducer(state, setBun(bun));
    expect(newState.bun).toEqual(bun);
  });

  it('Тест добавления ингредиента', () => {
    const newState = burgerConstructorReducer(
      state,
      addIngredient(ingredient1)
    );
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...ingredient1,
      id: expect.any(String)
    });
  });
  it('Тест удаления ингредиента', () => {
    const ingredientInConstructor: TConstructorIngredient = {
      ...ingredient1,
      id: 'id-1'
    };
    const newState = burgerConstructorReducer(
      { ...state, ingredients: [ingredientInConstructor] },
      removeIngredient(ingredientInConstructor)
    );
    expect(newState.ingredients).toHaveLength(0);
  });

  it('Тест перемещения ингредиента', () => {
    const ingredientInConstructor1: TConstructorIngredient = {
      ...ingredient1,
      id: 'id-1'
    };
    const ingredientInConstructor2: TConstructorIngredient = {
      ...ingredient2,
      id: 'id-2'
    };
    const newState = burgerConstructorReducer(
      {
        ...state,
        ingredients: [ingredientInConstructor1, ingredientInConstructor2]
      },
      moveIngredient({ position: 1, direction: 'Up' })
    );
    expect(newState.ingredients).toHaveLength(2);
    expect(newState.ingredients[0]).toEqual(ingredientInConstructor2);
    expect(newState.ingredients[1]).toEqual(ingredientInConstructor1);
  });
  it('Тест очистки конструктора', () => {
    const ingredientInConstructor: TConstructorIngredient = {
      ...ingredient1,
      id: 'id-1'
    };
    const newState = burgerConstructorReducer(
      { bun, ingredients: [ingredientInConstructor] },
      clearConstructor()
    );
    expect(newState).toEqual(initialState);
  });
});
