import React, { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import FormInput from '../Components/FormInput';
import environment from '../utils/environment';
import { API_CATEGORIES, API_COURSES, API_TAGS } from '../constants/ApiConstants';

function AddCourse(props) {
  const MyAlert = withReactContent(Swal);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [status, setStatus] = useState(200);
  const [tags, setTags] = useState([]);
  const [course, setCourse] = useState({
    name: '',
    deskripsi: '',
    price: 0,
    author_name: '',
    img_url: '',
    category: {
      ID: 'ALL',
    },
    tag: [],
  });

  useEffect(() => {
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

    Promise.all([getCategories, getTags])
      .then(([resCategories, resTags]) => Promise.all(
        [resCategories.json(), resTags.json()],
      ))
      .then(([dataCategories, dataTags]) => {
        if (dataCategories.statusCode !== 200) {
          throw new Error(dataCategories);
        }
        if (dataTags.statusCode !== 200) {
          throw new Error(dataTags);
        }
        setCategories(dataCategories.data);
        setTags(dataTags.data);
        setChecked(new Array(dataTags.data.length).fill(false));
      })
      .catch((err) => {
        MyAlert.fire({
          title: <strong>Error</strong>,
          html: <i>{JSON.parse(err.message).message}</i>,
          icon: 'error',
        }).then();
      });
  }, []);

  const handleChange = (event) => {
    const temp = {};
    if (event.target.name === 'category_id') {
      temp.ID = event.target.value;
      setCourse({
        ...course, category: temp,
      });
    } else {
      setCourse({
        ...course, [event.target.name]: event.target.value,
      });
    }
  };

  const changeTag = (position) => {
    const updatedCheckedState = checked.map((item, index) => (index === position ? !item : item));

    setChecked(updatedCheckedState);
  };

  const handleSubmit = (event) => {
    const arrTag = [];
    for (let i = 0; i < checked.length; i += 1) {
      if (checked[i] === true) {
        arrTag.push(tags[i].ID);
      }
    }
    event.preventDefault();
    const courseObj = {
      name: course.name,
      deskripsi: course.deskripsi,
      price: parseFloat(course.price),
      author_name: course.author_name,
      img_url: course.img_url,
      category_id: parseInt(course.category.ID, 10),
      tag: arrTag,
    };

    const postCourse = `${environment.baseRootApi}${API_COURSES}`;
    fetch(postCourse, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(courseObj),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => { throw new Error(text); });
      }
      return response.json();
    }).then((data) => {
      setStatus(201);
      MyAlert.fire({
        title: <strong>Success</strong>,
        html:
  <i>
    Course
    {' '}
    {data.data.name}
    {' '}
    Added
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

  useEffect(() => {
    if (status === 201) {
      navigate('/admin/course');
    }
  }, [status]);

  return (
    <div className="container mt-5 col-sm-12 col-lg-6">
      <h3 className="text-center">Add New Course</h3>
      <form onSubmit={handleSubmit} className="my-5">
        <FormInput handlechange={handleChange} type="text" placeholder="Name" name="name" value={course.name} htmlFor="nameUpdateCourse" />
        <FormInput handlechange={handleChange} type="text" placeholder="Deskripsi" name="deskripsi" value={course.deskripsi} htmlFor="deskripsiUpdateCourse" />
        <FormInput handlechange={handleChange} type="number" placeholder="0" name="price" value={course.price} htmlFor="authorNameUpdateCourse" />
        <FormInput handlechange={handleChange} type="text" placeholder="Author" name="author_name" value={course.author_name} htmlFor="authorNameUpdateCourse" />
        <FormInput handlechange={handleChange} type="text" placeholder="Image" name="img_url" value={course.img_url} htmlFor="imgUrlUpdateCourse" />
        <label className="w-100 dropdown" htmlFor="sort-by">
          <select id="sort-by" className="form-select" onChange={handleChange} name="category_id" value={course.category.ID}>
            <option value="All" selected hidden>All Category</option>
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
        <input data-testid="submitTransfer" type="submit" className="mt-3 btn btn-success form-control w-100" value="Add" />
      </form>
    </div>
  );
}

export default AddCourse;
