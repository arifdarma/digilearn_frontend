import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import { useEffect, useState } from 'react';
import Navigation from './Components/Navigation';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import Favourites from './pages/Favourites';
import CourseDetail from './pages/CourseDetail';
import Cart from './pages/Cart';

function App() {
  const [authenticate, setAuthenticate] = useState(localStorage.getItem('token'));
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart')));
  }, []);
  return (
    <div className="App container">
      <Routes>
        <Route path="/" element={<Navigation authenticate={authenticate} cart={cart} />}>
          <Route path="/" index element={<Home cart={cart} setCart={setCart} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-course" element={<MyCourses />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/course/:id" element={<CourseDetail setCart={setCart} cart={cart} />} />
          <Route path="/cart" element={<Cart setCart={setCart} cart={cart} />} />
          <Route path="/login" element={<Login authenticate={authenticate} setAuthenticate={setAuthenticate} />} />
          <Route path="/logout" element={<Logout authenticate={authenticate} setAuthenticate={setAuthenticate} />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
