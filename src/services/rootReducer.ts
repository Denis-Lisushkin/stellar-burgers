import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { ordersFeedSlice } from './slices/ordersFeedSlice';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { userSlice } from './slices/userSlice';
import { userOrderSlice } from './slices/userOrderSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  ordersFeedSlice,
  burgerConstructorSlice,
  userSlice,
  userOrderSlice
);

export default rootReducer;
