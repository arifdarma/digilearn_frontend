import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import Newbie from '../img/Newbie.png';
import Junior from '../img/Junior.png';
import Senior from '../img/Senior.png';
import Master from '../img/Master.png';

function ProfilePages() {
  const MyAlert = withReactContent(Swal);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(200);
  const [voucher, setVoucher] = useState([]);
  const [gift, setGift] = useState([]);
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
    const getGift = fetch('http://localhost:8080/users-gifts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    });

    Promise.all([getProfile, getVoucher, getGift])
      .then(([resProfile, resVoucher, resGift]) => Promise.all(
        [resProfile.json(), resVoucher.json(), resGift.json()],
      ))
      .then(([dataProfile, dataVoucher, dataGift]) => {
        if (dataProfile.statusCode !== 200) {
          throw new Error(dataProfile);
        }
        if (dataVoucher.statusCode !== 200) {
          throw new Error(dataVoucher);
        }
        if (dataGift.statusCode !== 200) {
          throw new Error(dataGift);
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
        setVoucher(dataVoucher.data);
        setGift(dataGift.data);
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
  }, []);
  if (error) {
    return <Navigate replace to="/login" />;
  }
  if (user.level === 'Newbie') {
    user.image = Newbie;
  } else if (user.level === 'Junior') {
    user.image = Junior;
  } else if (user.level === 'Senior') {
    user.image = Senior;
  } else if (user.level === 'Master') {
    user.image = Master;
  }
  return (
    <>
      <h1>Profile</h1>
      <img src={user.image} alt="Image" />
      <div>{user.name}</div>
      <div>{user.userName}</div>
      <div>{user.email}</div>
      <div>{user.phoneNo}</div>
      <div>{user.address}</div>
      <div>{user.referralCode}</div>
      <div>{user.level}</div>
      <h1>Voucher</h1>
      <div>
        {
          voucher.map((userVoucher) => (
            <div className="row border my-3" id={userVoucher.id}>
              <p className="col">{userVoucher.code}</p>
              <p className="col">{userVoucher.value}</p>
              <p className="col">{userVoucher.expired_date.split('T')[0]}</p>
              <p className="col">{userVoucher.status}</p>
            </div>
          ))
        }
      </div>
      <h1>Gift</h1>
      <div>
        {
                gift.map((userGift) => (
                  <div className="row border my-3" id={userGift.id}>
                    <p className="col">{userGift.gift_name}</p>
                    <p className="col">{userGift.status}</p>
                    <p className="col">{userGift.date_estimated.split('T')[0]}</p>
                  </div>
                ))
            }
      </div>
    </>
  );
}

export default ProfilePages;
