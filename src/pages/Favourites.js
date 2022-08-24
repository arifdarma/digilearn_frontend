import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function Favourites(props) {
  const [course, setCourse] = useState([]);
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
          throw new Error(dataCourses);
        }
        if (dataCourses.data === null) {
          setCourse([]);
        } else {
          setCourse(dataCourses.data);
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
    <div>
      {
        course.map((crs) => (
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
          </div>
        ))
      }
    </div>
  );
}

export default Favourites;
