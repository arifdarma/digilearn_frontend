import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPages(props) {
  const { authenticate, setAuthenticate } = props;
  const navigate = useNavigate();
  const [error, setError] = useState('');
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
    const postLogin = 'http://localhost:8080/signin';
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
    })
      .catch((err) => {
        setError(JSON.parse(err.message).error);
        setStatus(400);
      });
  };

  if (authenticate) {
    navigate('/');
  }

  return (
    <div>
      <div className="row-12 text-center">
        <h1 data-testid="transfer">Transfer</h1>
      </div>
      <div className="col-12 text-center">
        <form onSubmit={handleSubmit}>
          <div className="col-12 my-3">
            <label htmlFor="emailLogin" className="col-6">
              <input className="form-control" type="text" placeholder="email" name="email" value={login.email} onChange={handleChange} />
            </label>
            <label htmlFor="passwordLogin" className="col-6">
              <input className="form-control" type="password" placeholder="password" name="password" value={login.password} onChange={handleChange} />
            </label>
          </div>
          <input data-testid="submitTransfer" type="submit" className="btn btn-primary form-control w-50" value="Login" />
        </form>
      </div>
    </div>
  );
}

export default LoginPages;
