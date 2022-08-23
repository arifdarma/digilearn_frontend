import { useState } from 'react';
import { Navigate } from 'react-router-dom';

function LogoutPages(props) {
  const { authenticate, setAuthenticate } = props;
  setAuthenticate(null);
  localStorage.removeItem('token');
  return <Navigate replace to="/" />;
}

export default LogoutPages;
