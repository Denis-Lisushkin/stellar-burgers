import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuth: boolean;
  loginError?: string | null;
  registerError?: string | null;
  getUserError?: string | null;
  updateUserError?: string | null;
  logoutError?: string | null;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuth: false
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/registerUser',
  async (data) => {
    const res = await registerUserApi(data);
    if (!res.success || !res.user) {
      throw new Error('Регистрация не удалась');
    }
    setCookie('accessToken', res.accessToken);
    setCookie('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/loginUser',
  async (data) => {
    const res = await loginUserApi(data);
    if (!res.success || !res.user) {
      throw new Error('Вход не удался');
    }
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});
export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (data) => {
    const res = await updateUserApi(data);
    if (!res.success || !res.user) {
      throw new Error('Обновление пользователя не удалось');
    }
    return res.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUser: (state: TUserState) => state.user,
    getIsAuthChecked: (state: TUserState) => state.isAuthChecked,
    getLoginError: (state: TUserState) => state.loginError,
    getRegisterError: (state: TUserState) => state.registerError
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isAuthChecked = true;
        state.getUserError = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.getUserError =
          action.error.message || 'Ошибка при получении пользователя';
      })
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError =
          action.error.message || 'Ошибка при регистрации пользователя';
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError =
          action.error.message || 'Ошибка при входе пользователя';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutError =
          action.error.message || 'Ошибка при выходе пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError =
          action.error.message || 'Ошибка при обновлении пользователя';
      });
  }
});
export const userReducer = userSlice.reducer;
export const { getUser, getIsAuthChecked, getLoginError, getRegisterError } =
  userSlice.selectors;
