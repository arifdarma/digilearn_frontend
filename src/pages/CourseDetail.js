import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import environment from '../utils/environment';
import { API_COURSES, API_FAVOURITES, API_USER_COURSE } from '../constants/ApiConstants';
import Loading from '../Components/Loading';

function CourseDetail(props) {
  const { cart, setCart } = props;
  const MyAlert = withReactContent(Swal);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [ownedCourse, setOwnedCourse] = useState([]);
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
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
    const getCourseDetail = fetch(`${environment.baseRootApi}${API_COURSES}/${param.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const getCourses = fetch(`${environment.baseRootApi}${API_USER_COURSE}`, {
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
        setLoading(false);
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
    const postAddFavourite = `${environment.baseRootApi}${API_FAVOURITES}`;
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
      {
      loading ? (
        <Loading />
      ) : (
        <div className="my-3 border-bottom p-3">
          <div style={{ width: '100%' }} className="d-flex justify-content-between">
            <div>
              <p className="">
                <b>
                  {course.category}
                  {' >'}
                </b>
              </p>
              <div>
                <h1 className="mt-3 mb-0">{course.name}</h1>
                <p className="mt-0 mb-3 text-muted">
                  Bookmarked By
                  {' '}
                  {course.totalFavourite}
                  {' '}
                  Students
                </p>
                <p className=""><i>{course.authorName}</i></p>
                <p className="m-0">{formatter.format(course.price)}</p>
                <p className="mt-0 text-muted">
                  {course.totalCompleted}
                  {' '}
                  Students Has Finished The Course
                </p>
                <p className="">{course.deskripsi}</p>
              </div>
            </div>
            <div style={{ width: '30%', minWidth: '400px' }}>
              <div className="border p-5 rounded bg-white">
                <img src={course.img_url} className="" style={{ height: '100%', width: '100%', objectFit: 'cover' }} alt="..." />
              </div>
              <button type="button" className="mt-3 btn btn-success text-center text-white" onClick={() => handleClick(course.id)} style={{ width: '100%' }}>
                <h3>
                  Add To Cart
                  <i className="ms-3 bi bi-cart-plus-fill" />
                </h3>
              </button>
              <button type="button" className="mt-3 btn text-center text-white" onClick={() => handleFavourite(course.id)} style={{ width: '100%', background: '#292728' }}>
                <h3>
                  Add To Favourite
                  <i
                    className="ms-3 bi bi-bookmark-star-fill"
                  />
                </h3>
              </button>
            </div>
          </div>
        </div>
      )
    }
    </div>
  );
}

export default CourseDetail;
