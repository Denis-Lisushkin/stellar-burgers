import {
  userReducer,
  initialState,
  fetchUser,
  registerUser,
  loginUser,
  logoutUser,
  updateUser
} from '../services/slices/userSlice';
import { TUser } from '@utils-types';
import { TRegisterData, TLoginData } from '@api';

describe('userSlice reducer', () => {
  let state: typeof initialState;

  const mockUser: TUser = { name: 'Test User', email: 'test@test.ru' };
  const mockNewUser: TRegisterData = {
    name: 'New Test User ',
    email: 'newTest@test.ru',
    password: '123456'
  };
  const mockLoginUser: TLoginData = {
    email: 'login@mail.com',
    password: '123456'
  };

  beforeEach(() => {
    state = { ...initialState };
  });

  it('должен вернуть initialState по умолчанию', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Тест fetchUser', () => {
    it('должен установить isAuthChecked=true и очистить getUserError при pending', () => {
      const action = { type: fetchUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.getUserError).toBeNull();
    });

    it('должен сохранить пользователя, установить isAuth=true и isAuthChecked=true при fulfilled', () => {
      const action = { type: fetchUser.fulfilled.type, payload: mockUser };
      const newState = userReducer(state, action);
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuth).toBe(true);
      expect(newState.isAuthChecked).toBe(true);
    });

    it('должен установить ошибку и isAuthChecked=true при rejected', () => {
      const action = {
        type: fetchUser.rejected.type,
        error: { message: 'Ошибка при получении пользователя' }
      };
      const newState = userReducer(state, action);
      expect(newState.getUserError).toBe('Ошибка при получении пользователя');
      expect(newState.isAuthChecked).toBe(true);
    });
  });

  describe('Тест registerUser', () => {
    it('должен очистить registerError при pending', () => {
      const action = { type: registerUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.registerError).toBeNull();
    });

    it('должен сохранить пользователя и установить isAuth=true при fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockNewUser
      };
      const newState = userReducer(state, action);
      expect(newState.user).toEqual(mockNewUser);
      expect(newState.isAuth).toBe(true);
    });

    it('должен установить сообщение об ошибке регистрации пользователя при rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Ошибка при регистрации пользователя' }
      };
      const newState = userReducer(state, action);
      expect(newState.registerError).toBe(
        'Ошибка при регистрации пользователя'
      );
    });
  });

  describe('loginUser', () => {
    it('должен очистить loginError при pending', () => {
      const action = { type: loginUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.loginError).toBeNull();
    });

    it('должен сохранить пользователя и установить isAuth=true при fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockLoginUser
      };
      const newState = userReducer(state, action);
      expect(newState.user).toEqual(mockLoginUser);
      expect(newState.isAuth).toBe(true);
    });

    it('должен установить сообщение об ошибке входа пользователя при rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Ошибка при входе пользователя' }
      };
      const newState = userReducer(state, action);
      expect(newState.loginError).toBe('Ошибка при входе пользователя');
    });
  });

  describe('logoutUser', () => {
    it('должен очистить пользователя и установить isAuth=false при fulfilled', () => {
      state.user = mockUser;
      state.isAuth = true;
      const action = { type: logoutUser.fulfilled.type };
      const newState = userReducer(state, action);
      expect(newState.user).toBeNull();
      expect(newState.isAuth).toBe(false);
    });

    it('должен установить сообщение об ошибке выхода пользователя  при rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: { message: 'Ошибка при выходе пользователя' }
      };
      const newState = userReducer(state, action);
      expect(newState.logoutError).toBe('Ошибка при выходе пользователя');
    });
  });

  describe('updateUser', () => {
    it('должен очистить updateUserError при pending', () => {
      const action = { type: updateUser.pending.type };
      const newState = userReducer(state, action);
      expect(newState.updateUserError).toBeNull();
    });

    it('должен обновить пользователя при fulfilled', () => {
      state.user = mockUser;
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockNewUser
      };
      const newState = userReducer(state, action);
      expect(newState.user).toEqual(mockNewUser);
    });

    it('должен установить сообщение об ошибке обновления пользователя при rejected', () => {
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'Ошибка при обновлении пользователя' }
      };
      const newState = userReducer(state, action);
      expect(newState.updateUserError).toBe(
        'Ошибка при обновлении пользователя'
      );
    });
  });
});
