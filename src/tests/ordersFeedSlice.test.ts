import {
  ordersFeedReducer,
  fetchOrdersFeed,
  initialState
} from '../services/slices/ordersFeedSlice';
import { TOrdersData } from '@utils-types';

describe('ordersFeedSlice', () => {
  let state: typeof initialState;

  const mockOrdersFeed: TOrdersData = {
    orders: [
      {
        _id: '66a7dbd9d61d88001b56d350',
        status: 'done',
        name: 'Флюоресцентный бургер',
        createdAt: '2024-07-30T12:44:09.602Z',
        updatedAt: '2024-07-30T12:44:10.203Z',
        number: 12345,
        ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733cd']
      }
    ],
    total: 1000,
    totalToday: 50
  };

  beforeEach(() => {
    state = { ...initialState };
  });

  it('должен вернуть initialState по умолчанию', () => {
    expect(ordersFeedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен установить isLoading=true при pending', () => {
    const action = { type: fetchOrdersFeed.pending.type };
    const newState = ordersFeedReducer(state, action);
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('должен сохранить данные и isLoading=false при fulfilled', () => {
    const action = {
      type: fetchOrdersFeed.fulfilled.type,
      payload: mockOrdersFeed
    };
    const newState = ordersFeedReducer({ ...state, isLoading: true }, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.ordersFeed).toEqual(mockOrdersFeed);
  });

  it('должен сохранить ошибку и isLoading=false при rejected', () => {
    const action = {
      type: fetchOrdersFeed.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const newState = ordersFeedReducer({ ...state, isLoading: true }, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка загрузки');
  });

  it('должен поставить дефолтную ошибку если message отсутствует', () => {
    const action = { type: fetchOrdersFeed.rejected.type, error: {} };
    const newState = ordersFeedReducer({ ...state, isLoading: true }, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка при загрузке заказов из ленты');
  });
});
