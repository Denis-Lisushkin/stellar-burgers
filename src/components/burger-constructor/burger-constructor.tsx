import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getTotalPrice,
  getConstructorItems,
  clearConstructor
} from '../../services/slices/burgerConstructorSlice';
import {
  getOrderModalData,
  getOrderRequest,
  createOrder,
  resetModalDataAndRequest
} from '../../services/slices/userOrderSlice';
import { getUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorItems);
  const price = useSelector(getTotalPrice);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const user = useSelector(getUser);

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      return navigate('/login');
    }
    const order = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];
    try {
      await dispatch(createOrder(order));
      dispatch(clearConstructor());
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
    }
  };
  const closeOrderModal = () => {
    dispatch(resetModalDataAndRequest());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
