import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import UserUpload from './components/UserUpload';
import FileList from './components/FileList';
import UserProfileIcon from './components/UserProfileIcon';
import './styles.css';


function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <UserProfileIcon />
        </header>
        <nav>
          <ul className="nav-links">
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/files">File List</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" exact element={<Login/>} />
          <Route path="/upload" element={<UserUpload/>} />
          <Route path="/files" element={<FileList/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
