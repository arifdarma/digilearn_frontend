import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jwtDecode from 'jwt-decode';
import FormInput from '../Components/FormInput';
import { API_SIGNIN } from '../constants/ApiConstants';
import environment from '../utils/environment';

function Login(props) {
  const MyAlert = withReactContent(Swal);
  const { authenticate, setAuthenticate } = props;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState(200);
  const [login, setLogin] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setLogin({
      ...login, [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const postLogin = `${environment.baseRootApi}${API_SIGNIN}`;
    const loginObj = {
      email: login.email,
      password: login.password,
    };
    fetch(postLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginObj),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      setStatus(response.status);
      return response.json();
    }).then((data) => {
      localStorage.setItem('token', data.data.idToken);
      setAuthenticate(localStorage.getItem('token'));
      const decode = jwtDecode(data.data.idToken);
      setRole(decode.user.role);
    })
      .catch((err) => {
        setError(JSON.parse(err.message).message);
        setStatus(JSON.parse(err.message).statusCode);
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  };
  if (authenticate) {
    navigate('/');
  }

  return (
    <div>
      <div style={{ margin: '20% auto' }}>
        <div className="border rounded bg-white text-center col-sm-12 col-lg-4 position-relative p-3" style={{ margin: '0 auto' }}>
          <h1 data-testid="login" className="my-3">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="col my-5">
              <FormInput handlechange={handleChange} type="text" placeholder="email" name="email" value={login.email} htmlFor="emailLogin" />
              <FormInput handlechange={handleChange} type="password" placeholder="password" name="password" value={login.password} htmlFor="passwordLogin" />
              <input data-testid="submitTransfer" type="submit" className="btn btn-primary form-control w-100" value="Login" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
