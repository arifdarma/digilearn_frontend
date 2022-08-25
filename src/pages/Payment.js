import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import FormInput from '../Components/FormInput';

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
    const postPayment = 'http://localhost:8080/payments';
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
    <div>
      <div style={{ margin: '20% auto' }}>
        <div className="border rounded text-center w-25 position-relative p-3" style={{ margin: '0 auto' }}>
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
