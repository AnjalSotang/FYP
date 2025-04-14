import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const Protected = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  const isAuthenticated = token || localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default Protected;
