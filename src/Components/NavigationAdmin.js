import React, { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function NavigationAdmin(props) {
  const { authenticate } = props;
  const [role, setRole] = useState('');

  useEffect(() => {
    if (authenticate) {
      const decode = jwtDecode(authenticate);
      setRole(decode.user.role);
    }
  }, []);

  if (!authenticate) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div style={{ minHeight: '100vh', background: '#EEF7FC' }} className="position-relative">
      <nav className="navbar navbar-dark bg-dark navbar-expand-md justify-content-center">
        <div className="container">
          <a href="/" className="navbar-brand d-flex w-50 me-auto">DigiLearn</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsingNavbar3"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="navbar-collapse collapse w-100" id="collapsingNavbar3">
            <ul className="nav navbar-nav ms-auto w-100 justify-content-end">
              <li className="nav-item">
                <Link to="/admin/course" className="nav-link text-white">Course</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/transaction" className="nav-link text-white">Transaction</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/reward" className="nav-link text-white">Rewards</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/gift" className="nav-link text-white">Gifts</Link>
              </li>
              <li className="nav-item">
                <Link to="/logout" className="nav-link text-white" style={{ textDecoration: 'none' }}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container" style={{ paddingBottom: '5rem' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default NavigationAdmin;
