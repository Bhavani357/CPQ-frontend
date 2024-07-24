import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRouting: React.FC = () => {
  const jwtToken = Cookies.get('jwtToken');

  return jwtToken ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRouting;
