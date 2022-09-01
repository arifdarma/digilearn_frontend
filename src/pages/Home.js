import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Course from '../Components/Course';
import environment from '../utils/environment';
import {
  API_CATEGORIES, API_COURSES, API_TAGS, API_TRENDING_COURSE,
} from '../constants/ApiConstants';
import Loading from '../Components/Loading';

function Home(props) {
  const { cart, setCart } = props;
  const [course, setCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);
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
    const getCourses = fetch(`${environment.baseRootApi}${API_COURSES}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    });
    const getTrendingCourse = fetch(`${environment.baseRootApi}${API_TRENDING_COURSE}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
        setLoading(false);
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
    <div>
      {
        loading
          ? (
            <Loading />
          )
          : (
            <>
              <h2 className="text-start mt-3">Trending This Week</h2>
              {
        trendingCourse.length > 0 ? (
          <div className="grid-container">
            {
        trendingCourse.map((crs) => (
          <Course key={crs.id} course={crs} />
        ))
      }
          </div>
        ) : (
          <h5 className="mt-5 text-center   text-muted">No Trend In This Week</h5>
        )
      }

              <h2 className="mt-5 mb-2 text-start border-top pt-5">Courses</h2>
              <p className="text-start">
                Start learning now to improve your skill.
                We provide best courses from best author with best learning experience.
                Choose courses bellow now. You can also search course by courses type that you want.
                What are you waiting for,
                go purchase some course now and start improving your skill.
              </p>
              <form className="d-flex justify-content-between my-3">
                <div>
                  <label htmlFor="searching" className="mx-1">
                    <input className="form-control" id="searching" type="text" placeholder="search" name="filterName" onChange={handleChange} value={filterName} />
                  </label>
                  <label className="mx-1 dropdown" htmlFor="sort-by">
                    <select id="sort-by" className="mx-1 form-select" onChange={handleChange} name="filterCategories">
                      <option value="All" className="dropdown-item" selected>All Categories</option>
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
                </div>
                <div>
                  <label className="mx-1" htmlFor="sort-by">
                    <select id="sort-by" className="mx-1 form-select" onChange={handleChange} name="filterDate">
                      <option value="desc">Newest</option>
                      <option value="asc">Oldest</option>
                    </select>
                  </label>
                </div>
              </form>
              <div className="grid-container">
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
          )
      }
    </div>
  );
}

export default Home;
