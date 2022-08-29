import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import FormInput from '../Components/FormInput';
import { API_SIGNUP } from '../constants/ApiConstants';
import environment from '../utils/environment';

function Register() {
  const MyAlert = withReactContent(Swal);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [status, setStatus] = useState(200);
  const [register, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
    address: '',
    phone: '',
    referral_code: '',
  });
  const handleChange = (event) => {
    setRegister({
      ...register, [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const postRegister = `${environment.baseRootApi}${API_SIGNUP}`;
    const registerObj = {
      name: register.name,
      email: register.email,
      password: register.password,
      username: register.username,
      address: register.address,
      phone: register.phone,
      referral_code: register.referral_code,
    };
    fetch(postRegister, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerObj),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      setStatus(response.status);
      return response.json();
    }).then((data) => {
      navigate('/login');
    })
      .catch((err) => {
        setError(JSON.parse(err.message).error);
        setStatus(400);
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  };

  return (
    <div style={{ margin: '10% auto' }}>
      <div className="border bg-white rounded text-center w-25 position-relative p-3" style={{ margin: '0 auto' }}>
        <h1 data-testid="register" className="my-3">Register</h1>
        <form onSubmit={handleSubmit} className="my-5">
          <FormInput handlechange={handleChange} type="text" placeholder="Name" name="name" value={register.name} htmlFor="nameRegister" />
          <FormInput handlechange={handleChange} type="text" placeholder="Email" name="email" value={register.email} htmlFor="emailRegister" />
          <FormInput handlechange={handleChange} type="password" placeholder="Password" name="password" value={register.password} htmlFor="passwordRegister" />
          <FormInput handlechange={handleChange} type="text" placeholder="User Name" name="username" value={register.username} htmlFor="usernameRegister" />
          <FormInput handlechange={handleChange} type="text" placeholder="Address" name="address" value={register.address} htmlFor="addressRegister" />
          <FormInput handlechange={handleChange} type="text" placeholder="Phone" name="phone" value={register.phone} htmlFor="phoneRegister" />
          <FormInput handlechange={handleChange} type="text" placeholder="Referral Code" name="referral_code" value={register.referral_code} htmlFor="referralCodeRegister" />
          <input data-testid="submitTransfer" type="submit" className="btn btn-primary form-control w-100" value="Register" />
        </form>
      </div>
    </div>
  );
}

export default Register;
