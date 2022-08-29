import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import FormInput from '../Components/FormInput';
import { API_PAYMENTS } from '../constants/ApiConstants';
import environment from '../utils/environment';

function Payment() {
  const param = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(0);
  const [payment, setPayment] = useState({
    total: 0,
    invoice_id: parseInt(param.id, 10),
  });
  const MyAlert = withReactContent(Swal);
  useEffect(() => {
    setToken(param.token);
  }, []);

  const handleChange = (e) => {
    setPayment({
      ...payment, total: parseInt(e.target.value, 10),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const postPayment = `${environment.baseRootApi}${API_PAYMENTS}`;
    fetch(postPayment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payment),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      setStatus(data.statusCode);
      MyAlert.fire({
        title: <strong>Scan QR</strong>,
        html: <i>{data.data}</i>,
        icon: 'success',
      }).then();
    }).catch((err) => {
      MyAlert.fire({
        title: <strong>Error</strong>,
        html: <i>{JSON.parse(err.message).message}</i>,
        icon: 'error',
      }).then();
    });
  };

  useEffect(() => {
    if (status === 200) {
      navigate('/');
    }
  }, [status]);
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
      <div>
        <div className="border rounded text-center bg-white p-3">
          <h1 data-testid="login" className="my-3">Payment</h1>
          <form onSubmit={handleSubmit}>
            <div className="col my-5">
              <FormInput handlechange={handleChange} type="number" placeholder="0" name="total" value={payment.total} htmlFor="totalPayment" />
              <input type="submit" className="btn btn-primary form-control w-100" value="Pay" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
