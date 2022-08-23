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
    const getProfile = 'http://localhost:8080/users';
    fetch(getProfile, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      setStatus(response.status);
      return response.json();
    }).then((data) => {
      setUser({
        name: data.data.name,
        userName: data.data.user_name,
        email: data.data.email,
        phoneNo: data.data.phone_no,
        address: data.data.address,
        referralCode: data.data.referralCode,
        level: data.data.level,
      });
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
    </>
  );
}

export default ProfilePages;
