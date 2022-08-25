import {
  Link,
  Outlet,
} from 'react-router-dom';

function Navigation(props) {
  const { authenticate, cart } = props;

  return (
    <div className="my-3">
      <nav className="d-flex justify-content-between">
        <div className="navbar-brand">
          <Link to="/" className="nav-item text-black fs-2" style={{ textDecoration: 'none' }}>DigiLearn</Link>
        </div>
        <ul className="navbar-nav d-flex flex-row gap-3">
          <li className="nav-item ">
            <Link to="/" className="text-black" style={{ textDecoration: 'none' }}>Home</Link>
          </li>
          <li className="nav-item ">
            <Link to="/my-course" className="text-black" style={{ textDecoration: 'none' }}>My Course</Link>
          </li>
          <li className="nav-item ">
            <Link to="/favourites" className="text-black" style={{ textDecoration: 'none' }}>Favourites</Link>
          </li>
          <li className="nav-item ">
            <Link to="/profile" className="text-black" style={{ textDecoration: 'none' }}>Profile</Link>
          </li>
          {
            authenticate
              ? (
                <>
                  <li className="nav-item">
                    <Link to="/logout" className="text-black" style={{ textDecoration: 'none' }}>Logout</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/cart" className="text-black" style={{ textDecoration: 'none' }}>{cart.length}</Link>
                  </li>
                </>
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
