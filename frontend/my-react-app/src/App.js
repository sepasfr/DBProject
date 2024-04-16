import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import Appointments from './Appointments';
import Mechanics from './Mechanics';
import Vehicles from './Vehicles';
import ServicePricing from './ServicePricing';
import JobList from './Jobs';
import Customers from './Customers';
import './App.css';

const Footer = () => (
  <footer>
    <p>Contact:</p>
    <p>dm26690@georgiasouthern.edu</p>
    <p>vl02201@georgiasouthern.edu</p>
  </footer>
);

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/mechanics">Mechanics</Link></li>
            <li><Link to="/customers">Customers</Link></li>
            <li><Link to="/Vehicles">Vehicles</Link></li>
            <li><Link to="/jobs">Jobs</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/service-pricing">Service Pricing</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/service-pricing" element={<ServicePricing />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
