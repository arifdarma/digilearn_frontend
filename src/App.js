import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import Navigation from './Components/Navigation';
import LoginPages from './pages/LoginPages';

function App() {
  return (
    <div className="App container">
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route path="/login" index element={<LoginPages />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
