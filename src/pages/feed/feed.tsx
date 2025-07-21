import { useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrdersFeed,
  getAllFeedOrders,
  getIsLoading
} from '../../services/slices/ordersFeedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getAllFeedOrders);
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    dispatch(fetchOrdersFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchOrdersFeed());
  };

  if (isLoading) {
    return <Preloader />;
  }
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
