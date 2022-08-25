import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function MyCourses(props) {
  const [error, setError] = useState('');
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

  if (error) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      <h1>My Course</h1>
      {
        course.length === 0
          ? (
            <p className="text-muted" style={{ margin: '20% auto' }}>NO COURSE AVAILABLE</p>
          ) : (
            course.map((crs) => (
              <div className="row" id={crs.id}>
                <p className="col">{crs.course_name}</p>
                <p className="col">{crs.status}</p>
              </div>
            ))
          )
        }
    </div>
  );
}

export default MyCourses;
