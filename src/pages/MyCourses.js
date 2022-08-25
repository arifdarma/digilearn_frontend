import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function MyCourses(props) {
  const [error, setError] = useState('');
  const [learn, setLearn] = useState(false);
  const [course, setCourse] = useState([]);
  const MyAlert = withReactContent(Swal);
  useEffect(() => {
    const getCourses = fetch('http://localhost:8080/users-courses', {
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
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{err.message}</i>,
          icon: 'error',
        }).then();
      });
  }, []);

  useEffect(() => {
    if (learn) {
      const postDeliverGift = 'http://localhost:8080/gifts';
      fetch(postDeliverGift, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: null,
      }).then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      }).then((data) => {
        setError('');
      })
        .catch((err) => {
          setError(JSON.parse(err.message).message);
        });
    }
  }, [learn]);

  if (error === 'unauthorized error') {
    return <Navigate replace to="/login" />;
  }

  const startClick = (id) => {
    const postStartCourse = `http://localhost:8080/users-courses/${id}`;
    fetch(postStartCourse, {
      method: 'PATCH',
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
      setLearn(true);
      MyAlert.fire({
        title: <strong>Success</strong>,
        html: <i>{data.data}</i>,
        icon: 'success',
      }).then();
    })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  };

  return (
    <div>
      <h1>My Course</h1>
      {
        course.length === 0
          ? (
            <p className="text-muted" style={{ margin: '20% auto' }}>NO COURSE AVAILABLE</p>
          ) : (
            course.map((crs) => (
              <div className="row my-3" id={crs.id}>
                <p className="col">{crs.course_name}</p>
                <p className="col">{crs.status}</p>
                {
                  crs.status !== 'FINISHED' ? (
                    <button type="button" className="col btn btn-success" onClick={() => startClick(crs.id)}>Start Course</button>
                  ) : (
                    <button type="button" className="col btn disabled btn-dark" onClick={() => startClick(crs.id)}>Course Learn</button>
                  )
                }
              </div>
            ))
          )
        }
    </div>
  );
}

export default MyCourses;
