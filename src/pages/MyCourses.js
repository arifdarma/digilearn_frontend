import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { API_GIFTS, API_USER_COURSE } from '../constants/ApiConstants';
import environment from '../utils/environment';
import Loading from '../Components/Loading';

function MyCourses(props) {
  const [error, setError] = useState('');
  const [learn, setLearn] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState([]);
  const MyAlert = withReactContent(Swal);
  useEffect(() => {
    const getCourses = fetch(`${environment.baseRootApi}${API_USER_COURSE}`, {
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
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{err.message}</i>,
          icon: 'error',
        }).then();
      });
  }, [isUpdated]);

  useEffect(() => {
    if (learn) {
      const postDeliverGift = `${environment.baseRootApi}${API_GIFTS}`;
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

  if (error === 'Unauthorized') {
    return <Navigate replace to="/login" />;
  }

  const startClick = (id) => {
    const postStartCourse = `${environment.baseRootApi}${API_USER_COURSE}/${id}`;
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
      setIsUpdated(true);
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
      {
        loading ? (
          <Loading />
        ) : (
          <>
            <h1>My Course</h1>
            <div className="bg-white m-2 p-5 border rounded-5">
              {
        course.length === 0
          ? (
            <p className="text-muted" style={{ margin: '20% auto' }}>NO COURSE AVAILABLE</p>
          ) : (
            course.map((crs) => (
              <div className="row my-3" id={crs.id} style={{ textDecoration: 'none' }}>
                <Link to={{ pathname: `/course/${crs.course_id}` }} className="text-black col-lg-4 col-sm-12">
                  <p>{crs.course_name}</p>
                </Link>
                <p className="col-lg-4 col-sm-12">{crs.status}</p>
                {
                  crs.status !== 'FINISHED' ? (
                    <button type="button" className="col btn btn-success col-lg-4 col-sm-12" onClick={() => startClick(crs.id)}>Start Course</button>
                  ) : (
                    <button type="button" className="col btn disabled btn-dark col-sm-12 col-lg-4">Course Learn</button>
                  )
                }
              </div>
            ))
          )
        }
            </div>
          </>
        )
      }
    </div>
  );
}

export default MyCourses;
