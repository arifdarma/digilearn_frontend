import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import moment from 'moment';
import Newbie from '../img/Newbie.png';
import Junior from '../img/Junior.png';
import Senior from '../img/Senior.png';
import Master from '../img/Master.png';
import {
  API_USER_COURSE, API_USERS, API_USERS_GIFTS, API_VOUCHERS,
} from '../constants/ApiConstants';
import environment from '../utils/environment';
import Loading from '../Components/Loading';

function Profile() {
  const MyAlert = withReactContent(Swal);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(200);
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState([]);
  const [gift, setGift] = useState([]);
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
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
    const getProfile = fetch(`${environment.baseRootApi}${API_USERS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    });
    const getVoucher = fetch(`${environment.baseRootApi}${API_VOUCHERS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    });
    const getGift = fetch(`${environment.baseRootApi}${API_USERS_GIFTS}`, {
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
          throw new Error(dataProfile.message);
        }
        if (dataVoucher.statusCode !== 200) {
          throw new Error(dataVoucher.message);
        }
        if (dataGift.statusCode !== 200) {
          throw new Error(dataGift.message);
        }
        setUser({
          name: dataProfile.data.name,
          userName: dataProfile.data.user_name,
          email: dataProfile.data.email,
          phoneNo: dataProfile.data.phone_no,
          address: dataProfile.data.address,
          referralCode: dataProfile.data.referral_code,
          level: dataProfile.data.level,
        });
        if (dataVoucher.data === null) {
          setVoucher([]);
        } else {
          setVoucher(dataVoucher.data);
        }
        if (dataGift.data === null) {
          setGift([]);
        } else {
          setGift(dataGift.data);
        }
        setLoading(false);
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
  }, []);
  if (error === 'unauthorized error') {
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
    <div>
      {
        loading ? (
          <Loading />
        ) : (
          <>
            <h1 className="mt-5">Profile</h1>
            <div className="col">
              <div className="row">
                <div className="col">
                  <img src={user.image} alt="Image" />
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p>Name</p>
                </div>
                <div className="col">
                  <p>{user.name}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p>User Name</p>
                </div>
                <div className="col">
                  <p>{user.userName}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p>Email</p>
                </div>
                <div className="col">
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p>Phone Number</p>
                </div>
                <div className="col">
                  <p>{user.phoneNo}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p>Address</p>
                </div>
                <div className="col">
                  <p>{user.address}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p>Referral Code</p>
                </div>
                <div className="col">
                  <p>{user.referralCode}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <p>Level</p>
                </div>
                <div className="col">
                  <p>{user.level}</p>
                </div>
              </div>
            </div>
            <nav>
              <div className="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-voucher-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                  style={{ color: '#292728' }}
                >
                  Voucher
                </button>
                <button
                  className="nav-link"
                  id="nav-gift-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                  style={{ color: '#292728' }}
                >
                  Gift
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-voucher-tab">
                <div>
                  <table className="table bg-white border mt-3">
                    <thead className="text-white" style={{ background: '#292728' }}>
                      <tr>
                        <th scope="col">No</th>
                        <th scope="col">Code</th>
                        <th scope="col">Discount</th>
                        <th scope="col">Expired Date</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                voucher.length === 0
                  ? (
                    <tr className="text-muted">NO VOUCHER</tr>
                  )
                  : (
                    voucher.map((userVoucher, index) => (
                      userVoucher.status === 'USED' || moment(userVoucher.expired_date).isBefore(moment()) ? (
                        <tr key={userVoucher.id} style={{ color: 'white', background: 'gray' }}>
                          <th scope="row">
                            {index + 1}
                            .
                          </th>
                          <th className="col">{userVoucher.code}</th>
                          <th className="col">{userVoucher.value}</th>
                          <th className="col">{moment(userVoucher.expired_date).format('llll')}</th>
                          <th className="col">{userVoucher.status}</th>
                        </tr>
                      ) : (
                        <tr key={userVoucher.id} style={{ color: '#292728' }}>
                          <th scope="row">
                            {index + 1}
                            .
                          </th>
                          <th className="col">{userVoucher.code}</th>
                          <th className="col">{userVoucher.value}</th>
                          <th className="col">{moment(userVoucher.expired_date).format('llll')}</th>
                          <th className="col">{userVoucher.status}</th>
                        </tr>
                      )
                    ))
                  )
              }
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-gift-tab">
                <div>
                  <table className="table bg-white border mt-3">
                    <thead className="text-white" style={{ background: '#292728' }}>
                      <tr>
                        <th scope="col">No</th>
                        <th scope="col">Name</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date Estimated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
              gift.length === 0
                ? (
                  <tr>
                    <th className="text-muted">NO GIFT</th>
                  </tr>
                )
                : (
                  gift.map((userGift, index) => (
                    <tr scope="row" id={userGift.id}>
                      <th className="col">{index + 1}</th>
                      <th className="col">{userGift.gift_name}</th>
                      <th className="col">{userGift.status}</th>
                      <th className="col">{moment(userGift.date_estimated).format('llll')}</th>
                    </tr>
                  ))
                )
            }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}

export default Profile;
