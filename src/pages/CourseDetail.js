import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function CourseDetail(props) {
  const { cart, setCart } = props;
  const MyAlert = withReactContent(Swal);
  const [error, setError] = useState('');
  const [ownedCourse, setOwnedCourse] = useState([]);
  const [course, setCourse] = useState(
    {
      id: '',
      name: '',
      deskripsi: '',
      price: 0,
      authorName: '',
      totalCompleted: 0,
      totalFavourite: 0,
      img_url: '',
      category: '',
      tag: [],
    },
  );
  const param = useParams();

  useEffect(() => {
    const getCourseDetail = fetch(`http://localhost:8080/courses/${param.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const getCourses = fetch('http://localhost:8080/users-courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    });

    Promise.all([getCourses, getCourseDetail])
      .then(([resCourses, resCourseDetail]) => Promise.all(
        [resCourses.json(), resCourseDetail.json()],
      ))
      .then(([dataCourses, dataCourseDetail]) => {
        if (dataCourses.statusCode !== 200) {
          throw new Error(dataCourses.message);
        }
        if (dataCourseDetail.statusCode !== 200) {
          throw new Error(dataCourseDetail.message);
        }
        setCourse(
          {
            id: dataCourseDetail.data.id,
            name: dataCourseDetail.data.name,
            deskripsi: dataCourseDetail.data.deskripsi,
            price: dataCourseDetail.data.price,
            authorName: dataCourseDetail.data.author_name,
            totalCompleted: dataCourseDetail.data.total_completed,
            totalFavourite: dataCourseDetail.data.total_favourite,
            img_url: dataCourseDetail.data.img_url,
            category: dataCourseDetail.data.category.Name,
            tag: dataCourseDetail.data.tag,
          },
        );
        if (dataCourses.data === null) {
          setOwnedCourse([]);
        } else {
          setOwnedCourse(dataCourses.data);
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
  }, [cart]);
  if (error === 'unauthorized error') {
    return <Navigate replace to="/login" />;
  }

  const handleClick = (id) => {
    const c = JSON.parse(localStorage.getItem('cart'));
    const owned = ownedCourse.find((obj) => obj.course_id === id);
    if (owned) {
      MyAlert.fire({
        title: <strong>Error</strong>,
        html: <i>Course Owned</i>,
        icon: 'error',
      }).then();
      return;
    }
    if (!c || c.length === 0) {
      const arrCt = [];
      arrCt.push(course);
      localStorage.setItem('cart', JSON.stringify(arrCt));
      setCart(arrCt);
    } else {
      const ct = JSON.parse(localStorage.getItem('cart'));
      const cr = ct.find((obj) => obj.id === course.id);
      if (!cr) {
        setCart([...cart, course]);
        ct.push(course);
        localStorage.setItem('cart', JSON.stringify(ct));
      }
    }
  };

  const handleFavourite = (id) => {
    const postAddFavourite = 'http://localhost:8080/favourites';
    const favCourse = {
      course_id: id,
    };
    fetch(postAddFavourite, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(favCourse),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      MyAlert.fire({
        title: <strong>Favourite Added</strong>,
        html: <i>{data.data}</i>,
        icon: 'success',
      }).then();
    })
      .catch((err) => {
        setError(JSON.parse(err.message).message);
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  };

  return (
    <div>
      <h1>Courses</h1>
      <div className="row" id={course.id}>
        <img src={course.img_url} />
        <p className="col">{course.name}</p>
        <p className="col">{course.deskripsi}</p>
        <p className="col">{course.price}</p>
        <p className="col">{course.authorName}</p>
        <p className="col">{course.totalCompleted}</p>
        <p className="col">{course.totalFavourite}</p>
        <p className="col">{course.category}</p>
        <div className="row">
          {course.tag.map((tag) => (
            <p key={tag.ID} className="col">{tag.Name}</p>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => handleClick(course.id)}>Add To Cart</button>
      <button type="button" onClick={() => handleFavourite(course.id)}>Add To Favourite</button>
    </div>
  );
}

export default CourseDetail;
