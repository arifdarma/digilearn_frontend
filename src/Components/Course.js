import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function Course(props) {
  const MyAlert = withReactContent(Swal);
  const {
    course, cart, setCart, remove, removeClick,
  } = props;
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  return (
    <div className="col-lg-3 my-1 text-start">
      {
        remove ? (
          <div>
            <button type="button" className="btn btn-danger mb-3" onClick={() => removeClick(course.id)}>Remove</button>
          </div>
        ) : (
          <div />
        )
      }
      <Link to={{ pathname: `/course/${course.id}` }} className="text-black" style={{ textDecoration: 'none' }}>
        <div className="card text-decoration-none border-1 h-100">
          <img src={course.img_url} className="card-img-top p-3" style={{ height: '250px' }} alt="..." />
          <div className="card-body">
            <h5 className="card-title my-0">{course.name}</h5>
            <p className="text-dark my-0">
              (
              {course.category.Name}
              )
            </p>
            <p className="text-dark my-0">{course.author_name}</p>
            <p className="text-muted my-0">
              Time Purchased:
              {' '}
              {course.total_purchase}
            </p>
            <p className="card-text">
              <b>{formatter.format(course.price)}</b>
            </p>
            {course.tag.map((tag) => (
              <p key={tag.ID} className="my-0 ms-1 mt-1 fs-6 btn" style={{ background: 'lightgray' }}>
                #
                {tag.Name}
              </p>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Course;
