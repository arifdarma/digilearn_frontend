import React, { useState, useEffect } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import environment from '../utils/environment';
import {
  API_CATEGORIES, API_COURSES, API_TAGS,
} from '../constants/ApiConstants';
import FormInput from '../Components/FormInput';

function AdminCourse(props) {
  const MyAlert = withReactContent(Swal);
  const [update, setUpdate] = useState(false);
  const [course, setCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [tags, setTags] = useState([]);
  const [updateCourse, setUpdateCourse] = useState({
    id: 0,
    name: '',
    deskripsi: '',
    price: 0,
    author_name: '',
    total_completed: 0,
    total_favourite: 0,
    img_url: '',
    category: {
      ID: 0,
    },
    tag: [],
  });

  useEffect(() => {
    const getAllCourse = `${environment.baseRootApi}${API_COURSES}`;
    fetch(getAllCourse, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      setCourse(data.data);
    })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, [MyAlert, update]);

  const updateClick = (crs) => {
    const getCourses = fetch(`${environment.baseRootApi}${API_COURSES}/${crs.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: null,
    });
    const getCategories = fetch(`${environment.baseRootApi}${API_CATEGORIES}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    });
    const getTags = fetch(`${environment.baseRootApi}${API_TAGS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    });

    Promise.all([getCourses, getCategories, getTags])
      .then(([resCourses, resCategories, resTags]) => Promise.all(
        [resCourses.json(), resCategories.json(), resTags.json()],
      ))
      .then(([dataCourses, dataCategories, dataTags]) => {
        if (dataCourses.statusCode !== 200) {
          throw new Error(dataCourses);
        }
        if (dataCategories.statusCode !== 200) {
          throw new Error(dataCategories);
        }
        if (dataTags.statusCode !== 200) {
          throw new Error(dataTags);
        }
        setCategories(dataCategories.data);
        setTags(dataTags.data);
        setUpdateCourse(dataCourses.data);
      })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
    setUpdate(true);
  };

  useEffect(() => {
    const arr = new Array(tags.length).fill(false);
    for (let i = 0; i < tags.length; i += 1) {
      for (let j = 0; j < updateCourse.tag.length; j += 1) {
        if (updateCourse.tag[j].Name === tags[i].Name) {
          arr[i] = true;
        }
      }
    }
    setChecked(arr);
  }, [tags, updateCourse.tag]);

  const handleChange = (event) => {
    const temp = {};
    if (event.target.name === 'category_id') {
      temp.ID = event.target.value;
      setUpdateCourse({
        ...updateCourse, category: temp,
      });
    } else {
      setUpdateCourse({
        ...updateCourse, [event.target.name]: event.target.value,
      });
    }
  };

  const changeTag = (position) => {
    const updatedCheckedState = checked.map((item, index) => (index === position ? !item : item));

    setChecked(updatedCheckedState);
  };

  const submitCourse = (event, crs) => {
    setUpdate(false);
    event.preventDefault();
    const arrTag = [];
    for (let i = 0; i < checked.length; i += 1) {
      if (checked[i] === true) {
        arrTag.push(tags[i].ID);
      }
    }
    const updateObj = {
      name: crs.name,
      deskripsi: crs.deskripsi,
      price: crs.price,
      author_name: crs.author_name,
      img_url: crs.img_url,
      category_id: parseInt(crs.category.ID, 10),
      tag: arrTag,
    };
    const updateCourseDetail = `${environment.baseRootApi}${API_COURSES}/${crs.id}`;
    fetch(updateCourseDetail, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updateObj),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      MyAlert.fire({
        title: <strong>Success</strong>,
        html:
  <i>
    {data.data.name}
    {' '}
    Updated
  </i>,
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

  const deleteCourse = (id) => {
    const deleteCourseDetail = `${environment.baseRootApi}${API_COURSES}/${id}`;
    fetch(deleteCourseDetail, {
      method: 'DELETE',
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
    <div className="container mt-5">
      {
        update && (
          <form onSubmit={(e) => submitCourse(e, updateCourse)} className="my-5">
            <FormInput handlechange={handleChange} type="text" placeholder={updateCourse.name} name="name" value={updateCourse.name} htmlFor="nameUpdateCourse" />
            <FormInput handlechange={handleChange} type="text" placeholder={updateCourse.deskripsi} name="deskripsi" value={updateCourse.deskripsi} htmlFor="deskripsiUpdateCourse" />
            <FormInput handlechange={handleChange} type="number" placeholder={updateCourse.price} name="price" value={updateCourse.price} htmlFor="authorNameUpdateCourse" />
            <FormInput handlechange={handleChange} type="text" placeholder={updateCourse.author_name} name="author_name" value={updateCourse.author_name} htmlFor="authorNameUpdateCourse" />
            <FormInput handlechange={handleChange} type="text" placeholder={updateCourse.img_url} name="img_url" value={updateCourse.img_url} htmlFor="imgUrlUpdateCourse" />
            <label className="w-100 dropdown" htmlFor="sort-by">
              <select id="sort-by" className="form-select" onChange={handleChange} name="category_id" value={updateCourse.category.ID}>
                {
                      categories.map((c) => (
                        <option key={c.ID} value={c.ID}>{c.Name}</option>
                      ))
                    }
              </select>
            </label>
              {
                tags.map((t, index) => (
                  <label className="w-100 form-check" htmlFor="tags">
                    <input
                      type="checkbox"
                      name={t.Name}
                      value={t.ID}
                      checked={checked[index]}
                      onChange={() => changeTag(index)}
                      className="form-check-input"
                    />
                    <label htmlFor={`custom-checkbox-${index}`} className="form-check-label">{t.Name}</label>
                  </label>
                ))
              }
            <input data-testid="submitTransfer" type="submit" className="mt-3 btn btn-success form-control w-100" value="Update" />
          </form>
        )
      }
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Course Name</th>
            <th scope="col">Price</th>
            <th scope="col">Author Name</th>
            <th scope="col">Image</th>
            <th scope="col">Total Purchase</th>
            <th scope="col">Date Added</th>
            <th scope="col">Category</th>
            <th scope="col">Tag</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {
          course && (
            course.map((c, index) => (
              <tr key={c.id}>
                <td>{index + 1}</td>
                <td>{c.name}</td>
                <td>{c.price}</td>
                <td>{c.author_name}</td>
                <td>
                  <img src={c.img_url} style={{ maxWidth: '100px' }} alt="..." />
                </td>
                <td>{c.total_purchase}</td>
                <td>{c.date}</td>
                <td>{c.category.Name}</td>
                <td>
                  {
                    c.tag && (
                      c.tag.map((t) => (
                        <p className="row">{t.Name}</p>
                      ))
                    )
                  }
                </td>
                <td>
                  <div className="row px-5">
                    <button type="button" className="col mb-1 btn btn-warning" onClick={() => updateClick(c)}>UPDATE</button>
                    <button type="button" className="col btn btn-danger" onClick={() => deleteCourse(c.id)}>DELETE</button>
                  </div>
                </td>
              </tr>
            ))
          )
        }
        </tbody>
      </table>
    </div>
  );
}

export default AdminCourse;
