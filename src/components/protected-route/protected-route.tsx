import React from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { getIsAuthChecked, getUser } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  access?: 'auth' | 'unauth';
};

export const ProtectedRoute = ({
  access = 'auth',
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (access === 'unauth' && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }
  if (access === 'auth' && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
