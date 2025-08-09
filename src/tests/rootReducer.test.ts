import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../services/rootReducer';

test('Проверка правильной инициализации rootReducer', () => {
  const store = configureStore({
    reducer: rootReducer
  });

  expect(store.getState()).toEqual(
    rootReducer(undefined, { type: 'UNKNOWN_ACTION' })
  );
});
