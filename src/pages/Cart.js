import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function Cart(props) {
  const { cart, setCart } = props;
  const [total, setTotal] = useState(0);
  const MyAlert = withReactContent(Swal);
  const [error, setError] = useState('');
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState(200);
  const [voucher, setVoucher] = useState([]);
  const [disc, setDisc] = useState(0);
  const [purchase, setPurchase] = useState({
    voucher_id: 'null',
    total: 0,
    courses: [],
  });
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
    if (user.level === 'Junior') {
      setLevel(5);
    } else if (user.level === 'Senior') {
      setLevel(10);
    } else if (user.level === 'Master') {
      setLevel(20);
    }
  }, [user]);

  useEffect(() => {
    let temp = 0;
    const arrCourse = [];
    let vcId = purchase.voucher_id;
    for (const cartElement of cart) {
      temp += cartElement.price;
      arrCourse.push(cartElement.id);
    }
    const benefit = level / 100;
    temp -= (temp * benefit);
    temp -= disc;
    if (vcId === 'null') {
      vcId = 0;
    } else {
      vcId = parseInt(vcId, 10);
    }
    setTotal(temp);
    setPurchase({
      voucher_id: vcId,
      total: temp,
      courses: arrCourse,
    });
  }, [cart, level, disc]);

  useEffect(() => {
    const v = voucher.find((obj) => obj.id === parseInt(purchase.voucher_id, 10));
    if (v) {
      setDisc(parseInt(v.value, 10));
    }
    if (!v) {
      setDisc(0);
    }
  }, [purchase.voucher_id]);

  const removeCourse = (id) => {
    const c = JSON.parse(localStorage.getItem('cart'));
    const ct = c.filter((obj) => obj.id !== id);
    if (ct.length === 0) {
      localStorage.removeItem('cart');
    }
    setCart(ct);
    localStorage.setItem('cart', JSON.stringify(ct));
  };

  const handleChange = (event) => {
    setPurchase((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const handleClick = () => {
    const postInvoice = 'http://localhost:8080/purchase';
    fetch(postInvoice, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(purchase),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      MyAlert.fire({
        title: <strong>Purchased</strong>,
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
            <div className="row d-flex justify-content-center align-items-center">
              <h3 style={{ textAlign: 'end', verticalAlign: 'bottom' }} className="col-9">Voucher</h3>
              {
                  voucher.length === 0 ? (
                    <select className="disabled form-select my-3 col" id="voucher_id" name="source" onChange={handleChange} value={purchase.voucher_id}>
                      <option value={purchase.voucher_id} className="text-muted">No Voucher Available</option>
                    </select>
                  ) : (
                    <>
                      <select className="form-select my-3 col" id="voucher_id" name="source" onChange={handleChange} value={purchase.voucher_id}>
                        <option value={0}>Select Available Voucher</option>
                        {
                        voucher.map((v) => (
                          <option key={v.id} id={v.id} value={v.id}>
                            {v.value}
                          </option>
                        ))
                      }
                      </select>
                      {
                          disc === 0 ? (
                            <p />
                          ) : (
                            <h3 style={{ textAlign: 'end', verticalAlign: 'bottom' }}>
                              -
                              {disc}
                            </h3>
                          )
                        }
                    </>
                  )
                }
            </div>
            <h3 style={{ textAlign: 'end', verticalAlign: 'bottom' }}>
              Loyalty Benefit =
              {' '}
              {level}
              %
            </h3>
            <h3 style={{ textAlign: 'end', verticalAlign: 'bottom' }} onChange={handleChange}>
              Total =
              {' '}
              {total}
            </h3>
          </>
        )
      }
      <button type="submit" onClick={handleClick}>BUY</button>
    </div>
  );
}

export default Cart;
