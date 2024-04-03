import logo from './logo.svg';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
//each page component
const Mechanics = () => <div><h2>Mechanics</h2></div>;
const ServiceTracking = () => <div><h2>Service Tracking</h2></div>;
const Appointments = () => <div><h2>Appointments</h2></div>;
const CustomerList = () => <div><h2>Customer List</h2></div>;
const ServicePricing = () => <div><h2>Service Pricing</h2></div>;

// main app component
const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/mechanics">Mechanics</Link></li>
            <li><Link to="/service-tracking">Service Tracking</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/customer-list">Customer List</Link></li>
            <li><Link to="/service-pricing">Service Pricing</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/service-tracking" element={<ServiceTracking />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/service-pricing" element={<ServicePricing />} />
          {/* Redirect to mechanics as a default */}
          <Route path="/" element={<Mechanics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
