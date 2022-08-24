import React from 'react';
import { Link } from 'react-router-dom';

function Course(props) {
  const { course } = props;
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return (
    <div className="col-lg-3 text-start">
      <Link to={{ pathname: `/course/${course.id}` }} className="text-black" style={{ textDecoration: 'none' }}>
        <div className="card text-decoration-none border-0">
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
              <p className="my-0 ms-1 mt-1 fs-6 btn" style={{ background: 'lightgray' }}>
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
