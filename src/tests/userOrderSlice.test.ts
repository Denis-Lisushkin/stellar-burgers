import {
  userOrderReducer,
  initialState,
  createOrder,
  fetchUserOrders,
  fetchOrderByNumber,
  resetModalDataAndRequest
} from '../services/slices/userOrderSlice';
import { TOrder } from '@utils-types';

describe('userOrderSlice', () => {
  let state: typeof initialState;
  const mockOrder: TOrder = {
    _id: '66a7dbd9d61d88001b56d350',
    status: 'done',
    name: 'Флюоресцентный бургер',
    createdAt: '2024-07-30T12:44:09.602Z',
    updatedAt: '2024-07-30T12:44:10.203Z',
    number: 12345,
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733cd']
  };

  beforeEach(() => {
    state = { ...initialState };
  });

  it('должен вернуть initialState по умолчанию', () => {
    expect(userOrderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Тест createOrder', () => {
    it('должен установить состояние orderRequest=true при pending', () => {
      const action = { type: createOrder.pending.type };
      const newState = userOrderReducer(state, action);
      expect(newState.orderRequest).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен сохранить заказ и установить состояние orderRequest=false при fulfilled', () => {
      const payload = { order: mockOrder, name: 'Тестовый Бургер' };
      const action = { type: createOrder.fulfilled.type, payload };
      const nextState = userOrderReducer(state, action);
      expect(nextState.orderRequest).toBe(false);
      expect(nextState.orderModalData).toEqual(mockOrder);
    });

    it('должен сохранить сообщение об ошибке и установить состояние orderRequest=false при rejected', () => {
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка при создании заказа' }
      };
      const nextState = userOrderReducer(state, action);
      expect(nextState.orderRequest).toBe(false);
      expect(nextState.error).toBe('Ошибка при создании заказа');
    });
  });

  describe('Тест fetchUserOrders', () => {
    it('должен установить состояние isLoadingOrders=true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const nextState = userOrderReducer(state, action);
      expect(nextState.isLoadingOrders).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('должен сохранить заказы и установить состояние isLoadingOrders=false при fulfilled', () => {
      const orders = [mockOrder];
      const action = { type: fetchUserOrders.fulfilled.type, payload: orders };
      const nextState = userOrderReducer(state, action);
      expect(nextState.isLoadingOrders).toBe(false);
      expect(nextState.orders).toEqual(orders);
    });

    it('должен сохранить сообщение об ошибке и установить состояние isLoadingOrders=false при rejected', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Ошибка при загрузке заказов' }
      };
      const nextState = userOrderReducer(state, action);
      expect(nextState.isLoadingOrders).toBe(false);
      expect(nextState.error).toBe('Ошибка при загрузке заказов');
    });
  });

  describe('Тест fetchOrderByNumber', () => {
    it('должен при загрузки заказа по номеру установить состояние isLoadingNumber=true, при pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const nextState = userOrderReducer(state, action);
      expect(nextState.isLoadingNumber).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('должен сохранить данные заказа и установить состояние isLoadingNumber=false при fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const nextState = userOrderReducer(state, action);
      expect(nextState.isLoadingNumber).toBe(false);
      expect(nextState.orderModalData).toEqual(mockOrder);
    });

    it('должен сохранить сообщение об ошибке и установить состояние isLoadingNumber=false при rejected', () => {
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: 'Ошибка поиска заказа' }
      };
      const nextState = userOrderReducer(state, action);
      expect(nextState.isLoadingNumber).toBe(false);
      expect(nextState.error).toBe('Ошибка поиска заказа');
    });
  });

  describe('Тест resetModalDataAndRequest', () => {
    it('должен сбросить данные orderModalData и установить состояние orderRequest=false', () => {
      state.orderModalData = mockOrder;
      state.orderRequest = true;
      const nextState = userOrderReducer(state, resetModalDataAndRequest());
      expect(nextState.orderModalData).toBeNull();
      expect(nextState.orderRequest).toBe(false);
    });
  });
});
