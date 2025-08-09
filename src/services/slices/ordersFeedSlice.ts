import { getFeedsApi } from '@api';
import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

interface IOrdersFeedState {
  ordersFeed: TOrdersData | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: IOrdersFeedState = {
  ordersFeed: null,
  isLoading: false,
  error: null
};

export const fetchOrdersFeed = createAsyncThunk<TOrdersData>(
  'ordersFeed/fetchAll',
  async () => await getFeedsApi()
);

export const ordersFeedSlice = createSlice({
  name: 'ordersFeed',
  initialState,
  reducers: {},
  selectors: {
    getOrdersFeed: (state) => state.ordersFeed,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getAllFeedOrders: createSelector(
      (state) => state.ordersFeed?.orders,
      (orders) => orders ?? []
    )
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersFeed = action.payload;
      })
      .addCase(fetchOrdersFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке заказов из ленты';
      });
  }
});

export const ordersFeedReducer = ordersFeedSlice.reducer;
export const { getOrdersFeed, getIsLoading, getError, getAllFeedOrders } =
  ordersFeedSlice.selectors;
