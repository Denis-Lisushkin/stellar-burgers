import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { RootState } from '../store';

type TUserOrderState = {
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  isLoadingNumber: boolean;
  isLoadingOrders: boolean;
};
export const initialState: TUserOrderState = {
  orders: [],
  orderRequest: false,
  orderModalData: null,
  error: null,
  isLoadingNumber: false,
  isLoadingOrders: false
};

export const createOrder = createAsyncThunk<
  {
    order: TOrder;
    name: string;
  },
  string[]
>('userOrder/crateOrder', async (data) => {
  const res = await orderBurgerApi(data);
  if (!res.success || !res.order) {
    throw new Error('Ошибка при создании заказа');
  }
  return res;
});

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'userOrder/fetchAll',
  async () => await getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    if (!res.success || !res.orders || res.orders.length === 0) {
      throw new Error('Ошибка при загрузке заказа по номеру');
    }
    return res.orders[0];
  }
);

export const userOrderSlice = createSlice({
  name: 'userOrder',
  initialState,
  selectors: {
    getOrderRequest: (state: TUserOrderState) => state.orderRequest,
    getOrderModalData: (state: TUserOrderState) => state.orderModalData,
    getError: (state: TUserOrderState) => state.error,
    getIsLoadingNumber: (state: TUserOrderState) => state.isLoadingNumber,
    getIsLoadingOrder: (state: TUserOrderState) => state.isLoadingOrders,
    getOrders: (state: TUserOrderState) => state.orders
  },
  reducers: {
    resetModalDataAndRequest(state) {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<{ order: TOrder; name: string }>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload.order;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.error = action.error.message || 'Ошибка при загрузке заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingNumber = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingNumber = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingNumber = false;
        state.error =
          action.error.message || 'Ошибка при загрузке заказа по номеру';
      });
  }
});
export const userOrderReducer = userOrderSlice.reducer;
export const { resetModalDataAndRequest } = userOrderSlice.actions;
export const {
  getOrderRequest,
  getOrderModalData,
  getError,
  getIsLoadingNumber,
  getIsLoadingOrder,
  getOrders
} = userOrderSlice.selectors;

export const getOrderDataByNumber = (number: string) => (state: RootState) => {
  const num = Number(number);
  if (!num) return null;

  return (
    state.ordersFeed.ordersFeed?.orders.find((order) => order.number === num) ||
    state.userOrder.orders.find((order) => order.number === num) ||
    (state.userOrder.orderModalData?.number === num
      ? state.userOrder.orderModalData
      : null)
  );
};
export default userOrderSlice;
