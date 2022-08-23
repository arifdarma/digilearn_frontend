import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function LogoutPages(props) {
  const { authenticate, setAuthenticate } = props;
  useEffect(() => {
    const postLogout = 'http://localhost:8080/signout';
    fetch(postLogout, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      MyAlert.fire({
        title: <strong>Logged Out</strong>,
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
    setAuthenticate(null);
    localStorage.removeItem('token');
  }, []);
  const MyAlert = withReactContent(Swal);
  return <Navigate replace to="/" />;
}

export default LogoutPages;
