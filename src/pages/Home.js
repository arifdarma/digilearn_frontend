import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Course from '../Components/Course';

function Home(props) {
  const { cart, setCart } = props;
  const [error, setError] = useState('');
  const [status, setStatus] = useState(200);
  const [course, setCourse] = useState([]);
  const [trendingCourse, setTrendingCourse] = useState([]);
  useEffect(() => {
    const MyAlert = withReactContent(Swal);
    const getCourses = fetch('http://localhost:8080/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    });
    const getTrendingCourse = fetch('http://localhost:8080/trending-courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    });

    Promise.all([getCourses, getTrendingCourse])
      .then(([resCourses, resTrendingCourses]) => Promise.all(
        [resCourses.json(), resTrendingCourses.json()],
      ))
      .then(([dataCourses, dataTrendingCourse]) => {
        if (dataCourses.statusCode !== 200) {
          throw new Error(dataCourses);
        }
        if (dataTrendingCourse.statusCode !== 200) {
          throw new Error(dataTrendingCourse);
        }
        setCourse(dataCourses.data);
        if (dataTrendingCourse.data === null) {
          setTrendingCourse([]);
        } else {
          setTrendingCourse(dataTrendingCourse.data);
        }
      })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, []);
  return (
    <>
      <h1>Trending Course</h1>
      <div className="row">
        {
        trendingCourse.map((crs) => (
          <Course key={crs.id} course={crs} />
        ))
        }
      </div>
      <h1>Courses</h1>
      <div className="row">
        {
          course.map((crs) => (
            <Course key={crs.id} course={crs} cart={cart} setCart={setCart} />
          ))
        }
      </div>
    </>
  );
}

export default Home;
