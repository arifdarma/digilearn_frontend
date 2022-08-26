import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Course from '../Components/Course';

function Home(props) {
  const { cart, setCart } = props;
  const [course, setCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterCategories, setFilterCategories] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [filterObj, setFilterObj] = useState({
    filterName: '',
    filterDate: 'desc',
    filterCategories: 'All',
    filterTags: 'All',
  });
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
    const getCategories = fetch('http://localhost:8080/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    });
    const getTags = fetch('http://localhost:8080/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    });

    Promise.all([getCourses, getTrendingCourse, getCategories, getTags])
      .then(([resCourses, resTrendingCourses, resCategories, resTags]) => Promise.all(
        [resCourses.json(), resTrendingCourses.json(), resCategories.json(), resTags.json()],
      ))
      .then(([dataCourses, dataTrendingCourse, dataCategories, dataTags]) => {
        if (dataCourses.statusCode !== 200) {
          throw new Error(dataCourses);
        }
        if (dataTrendingCourse.statusCode !== 200) {
          throw new Error(dataTrendingCourse);
        }
        if (dataCategories.statusCode !== 200) {
          throw new Error(dataCategories);
        }
        if (dataTags.statusCode !== 200) {
          throw new Error(dataTags);
        }
        setCategories(dataCategories.data);
        setTags(dataTags.data);
        setCourse(dataCourses.data);
        setFilterCourse(dataCourses.data);
        setFilterDate('desc');
        setFilterCategories('All');
        setFilterTags('All');
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

  useEffect(() => {
    const temp = [...course];
    setFilterCourse(
      temp.filter(
        (obj) => obj.name.toLowerCase()
          .includes(filterName.toLowerCase()),
      )
        .sort((a, b) => {
          if (filterDate === 'desc') {
            return new Date(b.date) - new Date(a.date);
          }
          return new Date(a.date) - new Date(b.date);
        })
        .filter(
          (obj) => {
            if (filterCategories === 'All') {
              return obj;
            }
            return obj.category.Name.toLowerCase().includes(filterCategories.toLowerCase());
          },
        )
        .filter(
          (obj) => {
            if (filterTags === 'All') {
              return obj;
            }
            const resObj = obj.tag.find(
              (objTag) => objTag.Name.toLowerCase() === filterTags.toLowerCase(),
            );
            if (!resObj) {
              return false;
            }
            return obj;
          },
        ),
    );
  }, [filterName, filterDate, filterCategories, filterTags]);

  useEffect(() => {
    setFilterName(filterObj.filterName);
    setFilterDate(filterObj.filterDate);
    setFilterCategories(filterObj.filterCategories);
    setFilterTags(filterObj.filterTags);
  }, [filterObj]);

  const handleChange = (event) => {
    setFilterObj({
      ...filterObj,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = (event) => {
    setFilterObj({
      ...filterObj,
      [event.target.name]: event.target.value,
    });
  };

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
      <form className="d-flex justify-content-between my-3">
        <label htmlFor="searching" className="mx-1">
          <input className="form-control" id="searching" type="text" placeholder="search" name="filterName" onChange={handleChange} value={filterName} />
        </label>
        <label className="mx-1" htmlFor="sort-by">
          <select id="sort-by" className="mx-1 form-select" onChange={handleChange} name="filterCategories">
            <option value="All" selected>All Categories</option>
            {
              categories.map((c) => (
                <option key={c.ID} value={c.Name}>{c.Name}</option>
              ))
            }
          </select>
        </label>
        <label className="mx-1" htmlFor="sort-by">
          <select id="sort-by" className="mx-1 form-select" onChange={handleChange} name="filterTags" value={filterTags}>
            <option value="All" selected>All Tags</option>
            {
              tags.map((t) => (
                <option key={t.ID} value={t.Name}>{t.Name}</option>
              ))
            }
          </select>
        </label>
        <label className="mx-1" htmlFor="sort-by">
          <select id="sort-by" className="mx-1 form-select" onChange={handleChange} name="filterDate">
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </label>
      </form>
      <div className="row">
        {
          filterCourse.map((crs) => (
            <Course
              key={crs.id}
              course={crs}
              cart={cart}
              setCart={setCart}
              handleClick={handleClick}
            />
          ))
        }
      </div>
    </>
  );
}

export default Home;
