import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import Navigation from './Components/Navigation';

function App() {
  return (
    <div className="App container">
      <Routes>
        <Route path="/" element={<Navigation />} />
      </Routes>
    </div>
  );
}

export default App;
