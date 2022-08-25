import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from 'react-router-dom';
import Course from '../Components/Course';

function Favourites(props) {
  const navigate = useNavigate();
  const [course, setCourse] = useState([]);
  const [status, setStatus] = useState(200);
  const [error, setError] = useState('');
  const MyAlert = withReactContent(Swal);

  useEffect(() => {
    const getCourses = fetch('http://localhost:8080/favourites', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    });

    Promise.all([getCourses])
      .then(([resCourses]) => Promise.all(
        [resCourses.json()],
      ))
      .then(([dataCourses]) => {
        if (dataCourses.statusCode !== 200) {
          throw new Error(dataCourses.message);
        }
        if (dataCourses.data === null) {
          setCourse([]);
        } else {
          setCourse(dataCourses.data);
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
  }, []);

  const removeClick = (id) => {
    const postRemoveFavourite = `http://localhost:8080/favourites/${id}`;
    fetch(postRemoveFavourite, {
      method: 'DELETE',
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
      setStatus(data.statusCode);
      MyAlert.fire({
        title: <strong>Success</strong>,
        html: <i>{data.data}</i>,
        icon: 'success',
      }).then();
    })
      .catch((err) => {
        setStatus(err.statusCode);
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  };

  useEffect(() => {
    if (error === 'unauthorized error') {
      navigate('/login');
    }
  }, [status]);

  return (
    <>
      <h1>Favourites</h1>
      <div className="row">
        {
          course.length === 0
            ? (
              <p className="text-muted" style={{ margin: '20% auto' }}>NO COURSE AVAILABLE</p>
            ) : (
              course.map((crs) => (
                <Course course={crs} remove removeClick={removeClick} />
              ))
            )
      }
      </div>
    </>
  );
}

export default Favourites;
