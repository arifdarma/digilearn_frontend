import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import { useState } from 'react';
import Navigation from './Components/Navigation';
import LoginPages from './pages/LoginPages';
import LogoutPages from './pages/LogoutPages';
import HomePages from './pages/HomePages';

function App() {
  const [authenticate, setAuthenticate] = useState(localStorage.idToken);
  return (
    <div className="App container">
      <Routes>
        <Route path="/" element={<Navigation authenticate={authenticate} />}>
          <Route path="/" index element={<HomePages />} />
          <Route path="/login" index element={<LoginPages authenticate={authenticate} setAuthenticate={setAuthenticate} />} />
          <Route path="/logout" index element={<LogoutPages authenticate={authenticate} setAuthenticate={setAuthenticate} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
