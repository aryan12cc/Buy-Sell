import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Profile from './profile';
import SellItem from './sell-item';
import PendingDeliveries from './pending-deliveries';
import Catalogue from './catalogue';
import OrderHistory from './history';
import Cart from './cart';
import ViewItem from './view-item';
import { GoogleReCaptchaProvider } from  'react-google-recaptcha-v3';

const root = ReactDOM.createRoot(document.getElementById('root'));

const RedirectToLogin = () => {
    React.useEffect(() => {
        window.location.href = '/login.html';  // Redirect to the login.html file
    }, []);
    return null;  // This component doesn't render anything
};

root.render(
  <GoogleReCaptchaProvider reCaptchaKey="6LfV68sqAAAAABobwzqGjuShujYMgwM4jSrGxPn-">
    <Router>
      <Routes>
        <Route path="/" element={<RedirectToLogin />} />
        <Route path="/login.html" element={<Login />} />
        <Route path="/profile.html" element={<Profile />} />
        <Route path="/sell-item.html" element={<SellItem />} />
        <Route path="/pending-deliveries.html" element={<PendingDeliveries />} />
        <Route path="/catalogue.html" element={<Catalogue />} />
        <Route path="/history.html" element={<OrderHistory />} />
        <Route path="/cart.html" element={<Cart />} />
        <Route path="/view-item/:id.html" element={<ViewItem />} />
      </Routes>
    </Router>
  </GoogleReCaptchaProvider>
);
