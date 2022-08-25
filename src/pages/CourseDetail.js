import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function CourseDetail(props) {
  const { cart, setCart } = props;
  const MyAlert = withReactContent(Swal);
  const [error, setError] = useState('');
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
    const getCourseDetail = `http://localhost:8080/courses/${param.id}`;
    fetch(getCourseDetail, {
      method: 'GET',
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
      setCourse(
        {
          id: data.data.id,
          name: data.data.name,
          deskripsi: data.data.deskripsi,
          price: data.data.price,
          authorName: data.data.author_name,
          totalCompleted: data.data.total_completed,
          totalFavourite: data.data.total_favourite,
          img_url: data.data.img_url,
          category: data.data.category.Name,
          tag: data.data.tag,
        },
      );
    })
      .catch((err) => {
        setError(JSON.parse(err.message).message);
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, []);
  useEffect(() => {
  }, [cart]);
  if (error === 'unauthorized error') {
    return <Navigate replace to="/login" />;
  }

  const handleClick = () => {
    const cr = cart.find((obj) => obj.id === course.id);
    if (!cr) {
      setCart([...cart, course]);
    }
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
            <p className="col">{tag.Name}</p>
          ))}
        </div>
      </div>
      <button type="button" onClick={handleClick}>Add To Cart</button>
    </div>
  );
}

export default CourseDetail;
