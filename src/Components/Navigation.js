import {
  Link,
  Outlet,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navigation(props) {
  const { authenticate } = props;
  return (
    <div className="my-3">
      <nav className="d-flex justify-content-between">
        <div className="navbar-brand">
          <Link to="/" className="nav-item text-black" style={{ textDecoration: 'none' }}>OLearn</Link>
        </div>
        <ul className="navbar-nav d-flex flex-row gap-3">
          <li className="nav-item ">
            <Link to="/" className="text-black" style={{ textDecoration: 'none' }}>Home</Link>
          </li>
          {
            authenticate
              ? (
                <li className="nav-item">
                  <Link to="/logout" className="text-black" style={{ textDecoration: 'none' }}>Logout</Link>
                </li>
              )
              : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="text-black" style={{ textDecoration: 'none' }}>Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="text-black" style={{ textDecoration: 'none' }}>Register</Link>
                  </li>
                </>
              )
          }
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navigation;
