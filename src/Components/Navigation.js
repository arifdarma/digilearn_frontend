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
        <ul className="nav navbar-nav d-flex flex-row gap-3">
          <li className="nav-item ">
            <Link to="/" className="nav-link text-black">Home</Link>
          </li>
          <li className="nav-item ">
            <Link to="/my-course" className="nav-link text-black" style={{ textDecoration: 'none' }}>My Course</Link>
          </li>
          <li className="nav-item ">
            <Link to="/favourites" className="nav-link text-black" style={{ textDecoration: 'none' }}>Favourites</Link>
          </li>
          <li className="nav-item ">
            <Link to="/profile" className="nav-link text-black" style={{ textDecoration: 'none' }}>Profile</Link>
          </li>
          {
            authenticate
              ? (
                <>
                  <li className="nav-item">
                    <Link to="/history" className="nav-link text-black" style={{ textDecoration: 'none' }}>History</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/logout" className="nav-link text-black" style={{ textDecoration: 'none' }}>Logout</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/cart" className="nav-link text-black " style={{ textDecoration: 'none' }}>
                      <i className="bi bi-cart-fill position-relative" style={{ fontSize: '130%' }}>
                        <span
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                          style={{ fontSize: '60%' }}
                        >
                          {cart.length}
                        </span>
                      </i>
                    </Link>
                  </li>
                </>
              )
              : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link text-black" style={{ textDecoration: 'none' }}>Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link text-black" style={{ textDecoration: 'none' }}>Register</Link>
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
