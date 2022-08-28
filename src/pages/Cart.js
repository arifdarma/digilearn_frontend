import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import moment from 'moment';

function Cart(props) {
  const { cart, setCart } = props;
  const [total, setTotal] = useState(0);
  const MyAlert = withReactContent(Swal);
  const [userVoucher, setUserVoucher] = useState([]);
  const [codeVoucher, setCodeVoucher] = useState('');
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
    const ct = JSON.parse(localStorage.getItem('cart')) || [];
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
    let vcId;
    if (userVoucher.length > 0) {
      vcId = userVoucher[0].id;
    } else {
      vcId = 'null';
    }
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
    if (userVoucher.length === 0) {
      setDisc(0);
    } else {
      const v = voucher.find((obj) => obj.id === userVoucher[0].id);
      if (v) {
        setDisc(parseInt(v.value, 10));
      }
      if (!v) {
        setDisc(0);
      }
    }
  }, [userVoucher]);

  useEffect(() => {
    const temp = [...voucher];
    setUserVoucher(temp.filter(
      (obj) => obj.status === 'UNUSED',
    )
      .filter(
        (obj) => obj.code.toLowerCase()
          .includes(codeVoucher.toLowerCase()),
      ));
  }, [codeVoucher, voucher]);

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
    let qrPayment = 'http://localhost:3000/purchase/';
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
      localStorage.removeItem('cart');
      setCart([]);
      qrPayment += `${data.data.id}/${localStorage.getItem('token')}`;
      MyAlert.fire({
        title: <strong>Scan QR</strong>,
        html: <i><QRCode value={qrPayment} /></i>,
        icon: 'info',
      }).then();
    }).catch((err) => {
      MyAlert.fire({
        title: <strong>Error</strong>,
        html: <i>{JSON.parse(err.message).message}</i>,
        icon: 'error',
      }).then();
    });
  };

  const voucherChange = (event) => {
    setCodeVoucher(event.target.value);
  };
  return (
    <div>
      {
        cart.length === 0 ? (
          <h3 className="text-muted mt-5">Cart Is Empty</h3>
        ) : (
          <>
            <h2 className="mt-3">Cart</h2>
            {' '}
            <div className="row">
              <div className="col-8">
                {
            cart.map((c) => (
              <div key={c.id} className="row my-3">
                <div className="col-1 d-flex justify-content-center align-items-center">
                  <button type="button" className="btn btn-danger" onClick={() => removeCourse(c.id)}>X</button>
                </div>
                <div style={{ width: '30%' }}>
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
              </div>
              <div className="col-4">
                <div className="row">
                  <div className="col border rounded-1 bg-white ">
                    <div className="row rounded" style={{ background: '#292728' }}>
                      <h2 className="text-center text-white">INVOICES</h2>
                    </div>
                    <div className="row mt-1">
                      <p className="col-8 text-start">Loyalty Benefit</p>
                      <p className="col-4">
                        {level}
                        %
                      </p>
                    </div>
                    <div className="row mt-1">
                      <p className="col-8 text-start">Discount</p>
                      {
                        userVoucher.length > 0 ? (
                          <p className="col-4">{userVoucher[0].value}</p>
                        ) : (
                          <p className="col-4">0</p>
                        )
                      }
                    </div>
                    <div className="row mt-1 border-top pt-3">
                      <h4 className="col-8 text-start">Total</h4>
                      <h4 className="col-4">{total}</h4>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <div className="row">
                      <h5 className="col">
                        Voucher Code
                      </h5>
                      <label htmlFor="voucherCode" className="col">
                        <input className="form-control" id="voucherCode" type="text" placeholder="Voucher Code" name="codeVoucher" onChange={voucherChange} value={codeVoucher} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <div className="row">
                      <div className="col">
                        <button type="submit" className="btn btn-success w-100" onClick={handleClick}>BUY</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row bg-white mt-4">
                  <div className="col border rounded">
                    <div className="row border rounded" style={{ background: '#292728' }}>
                      <div className="text-center">
                        <h3 className="text-white">Voucher List Code</h3>
                      </div>
                    </div>
                    <div className="row">
                      {
                        userVoucher.length === 0 ? (
                          <h5 className="text-muted">No Voucher Available</h5>
                        ) : (
                          userVoucher.map((v) => (
                            v.status === 'UNUSED' && !(moment(v.expired_date).isBefore(moment())) && (
                              <div className="row">
                                <p className="col">{v.code}</p>
                                <p className="col">{formatter.format(v.value)}</p>
                              </div>
                            )
                          ))
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}

export default Cart;
