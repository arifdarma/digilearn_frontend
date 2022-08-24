import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function Home() {
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
      {
        trendingCourse.map((crs) => (
          <div className="row" id={crs.id}>
            <p className="col">{crs.name}</p>
            <p className="col">{crs.price}</p>
            <p className="col">{crs.author_name}</p>
            <p className="col">{crs.total_purchase}</p>
            <p className="col">{crs.category.Name}</p>
            <div className="row">
              {crs.tag.map((tag) => (
                <p className="col">{tag.Name}</p>
              ))}
            </div>
            <Link to={{ pathname: `/course/${crs.id}` }}>COURSE</Link>
          </div>
        ))
        }
      <h1>Courses</h1>
      {
        course.map((crs) => (
          <Link to={{ pathname: `/course/${crs.id}` }}>
            <div className="row border my-3" id={crs.id}>
              <p className="col">{crs.name}</p>
              <p className="col">{crs.price}</p>
              <p className="col">{crs.author_name}</p>
              <p className="col">{crs.total_purchase}</p>
              <p className="col">{crs.category.Name}</p>
              <div className="row">
                {crs.tag.map((tag) => (
                  <p className="col">{tag.Name}</p>
                ))}
              </div>
            </div>
          </Link>
        ))
      }
    </>
  );
}

export default Home;
