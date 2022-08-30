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
import Payment from './pages/Payment';
import History from './pages/History';
import NavigationAdmin from './Components/NavigationAdmin';
import AdminCourse from './pages/AdminCourse';
import AdminTransaction from './pages/AdminTransaction';
import AdminReward from './pages/AdminReward';
import AdminGift from './pages/AdminGift';
import AddCourse from './pages/AddCourse';

function App() {
  const [authenticate, setAuthenticate] = useState(localStorage.getItem('token'));
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);
  return (
    <div className="App" style={{ background: '#EEF7FC' }}>
      <Routes>
        <Route path="/" element={<Navigation authenticate={authenticate} cart={cart} />}>
          <Route path="/" index element={<Home cart={cart} setCart={setCart} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-course" element={<MyCourses />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/history" element={<History />} />
          <Route path="/course/:id" element={<CourseDetail setCart={setCart} cart={cart} />} />
          <Route path="/cart" element={<Cart setCart={setCart} cart={cart} />} />
          <Route path="/login" element={<Login authenticate={authenticate} setAuthenticate={setAuthenticate} />} />
          <Route path="/logout" element={<Logout authenticate={authenticate} setAuthenticate={setAuthenticate} />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/admin/" element={<NavigationAdmin authenticate={authenticate} />}>
          <Route path="/admin/course" index element={<AdminCourse />} />
          <Route path="/admin/transaction" index element={<AdminTransaction />} />
          <Route path="/admin/reward" index element={<AdminReward />} />
          <Route path="/admin/gift" index element={<AdminGift />} />
          <Route path="/admin/add-course" index element={<AddCourse />} />
        </Route>
        <Route path="/purchase/:id/:token" element={<Payment />} />
      </Routes>
    </div>
  );
}

export default App;
