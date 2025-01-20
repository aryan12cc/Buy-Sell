import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Profile from './profile';

const root = ReactDOM.createRoot(document.getElementById('root'));

const RedirectToLogin = () => {
    React.useEffect(() => {
        window.location.href = '/login.html';  // Redirect to the login.html file
    }, []);
    return null;  // This component doesn't render anything
};

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<RedirectToLogin />} />
      <Route path="/login.html" element={<Login />} />
      <Route path="/profile.html" element={<Profile />} />
    </Routes>
  </Router>
);
