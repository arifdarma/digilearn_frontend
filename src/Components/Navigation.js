import {
  Link,
  Outlet,
} from 'react-router-dom';

function Navigation() {
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
          <li className="nav-item">
            <Link to="/login" className="text-black" style={{ textDecoration: 'none' }}>Login</Link>
          </li>
          <li className="nav-item">
            <Link to="/transfer" className="text-black" style={{ textDecoration: 'none' }}>Register</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navigation;
