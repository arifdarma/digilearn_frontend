import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function Cart(props) {
  const { cart, setCart } = props;
  const [total, setTotal] = useState(0);
  const MyAlert = withReactContent(Swal);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(200);
  const [voucher, setVoucher] = useState([]);
  const [user, setUser] = useState({
    name: '',
    userName: '',
    email: '',
    phoneNo: '',
    address: '',
    referralCode: '',
    level: '',
    image: '',
  });
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  useEffect(() => {
    const getProfile = fetch('http://localhost:8080/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    });
    const getVoucher = fetch('http://localhost:8080/vouchers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    });

    Promise.all([getProfile, getVoucher])
      .then(([resProfile, resVoucher]) => Promise.all(
        [resProfile.json(), resVoucher.json()],
      ))
      .then(([dataProfile, dataVoucher]) => {
        if (dataProfile.statusCode !== 200) {
          throw new Error(dataProfile.message);
        }
        if (dataVoucher.statusCode !== 200) {
          throw new Error(dataVoucher.message);
        }
        setUser({
          name: dataProfile.data.name,
          userName: dataProfile.data.user_name,
          email: dataProfile.data.email,
          phoneNo: dataProfile.data.phone_no,
          address: dataProfile.data.address,
          referralCode: dataProfile.data.referralCode,
          level: dataProfile.data.level,
        });
        if (dataVoucher.data === null) {
          setVoucher([]);
        } else {
          setVoucher(dataVoucher.data);
        }
      })
      .catch((err) => {
        setError(err.message);
        setStatus(401);
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{err.message}</i>,
          icon: 'error',
        }).then();
      });
    const ct = JSON.parse(localStorage.getItem('cart'));
    setCart(ct);
  }, []);

  useEffect(() => {
    let temp = 0;
    for (const cartElement of cart) {
      temp += cartElement.price;
    }
    setTotal(temp);
  }, [cart]);

  const removeCourse = (id) => {
    const c = JSON.parse(localStorage.getItem('cart'));
    const ct = c.filter((obj) => obj.id !== id);
    if (ct.length === 0) {
      localStorage.removeItem('cart');
    }
    setCart(ct);
    localStorage.setItem('cart', JSON.stringify(ct));
  };
  return (
    <div>
      {
        cart.length === 0 ? (
          <h3 className="text-muted">Cart Is Empty</h3>
        ) : (
          <>
            <h2>Cart</h2>
            {' '}
            {
            cart.map((c) => (
              <div key={c.id} className="row my-3">
                <div className="col-1 d-flex justify-content-center align-items-center">
                  <button type="button" className="btn btn-danger" onClick={() => removeCourse(c.id)}>X</button>
                </div>
                <div style={{ width: '20%' }}>
                  <img src={c.img_url} className="col" width="100%" />
                </div>
                <div className="col text-start">
                  <h3>{c.name}</h3>
                  <p>{c.authorName}</p>
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                  <h3>{formatter.format(c.price)}</h3>
                </div>
              </div>
            ))
            }
            <h3 style={{ textAlign: 'end', verticalAlign: 'bottom' }}>
              Total =
              {' '}
              {total}
            </h3>
          </>
        )
      }
    </div>
  );
}

export default Cart;
