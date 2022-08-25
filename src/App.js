import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import { useState } from 'react';
import Navigation from './Components/Navigation';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import Favourites from './pages/Favourites';
import CourseDetail from './pages/CourseDetail';

function App() {
  const [authenticate, setAuthenticate] = useState(localStorage.getItem('token'));
  const [cart, setCart] = useState([]);
  return (
    <div className="App container">
      <Routes>
        <Route path="/" element={<Navigation authenticate={authenticate} cart={cart} />}>
          <Route path="/" index element={<Home cart={cart} setCart={setCart} />} />
          <Route path="/profile" index element={<Profile />} />
          <Route path="/my-course" index element={<MyCourses />} />
          <Route path="/favourites" index element={<Favourites />} />
          <Route path="/course/:id" index element={<CourseDetail setCart={setCart} cart={cart} />} />
          <Route path="/login" index element={<Login authenticate={authenticate} setAuthenticate={setAuthenticate} />} />
          <Route path="/logout" index element={<Logout authenticate={authenticate} setAuthenticate={setAuthenticate} />} />
          <Route path="/register" index element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
