import React from 'react';
import jwtDecode from 'jwt-decode';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  try {
    jwtDecode(token, { header: true });
    const decodeJwt = jwtDecode(token);
    const { role } = decodeJwt.user;
    if (role !== 'ADMIN') {
      return <Navigate to="/" />;
    }
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return token ? children : <Navigate to="/login" />;
}

export default AdminRoute;
