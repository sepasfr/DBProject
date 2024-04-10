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
const Home = () => 
{
<div><h2>Home</h2></div>
return (
  <div className="image-container">
    <img src="/Man2.jpg" alt="Man working on Car" />
    <div className="text-over-image">Welcome to ShopWizard!</div>
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
  <button onClick={() => console.log('Get Started clicked')} style={{position: 'absolute', top: '20%', left: '44%', transform: 'translate(0%, 0%)', padding: '10px 20px', fontSize: '32px' }}> Get Started </button>
  </div>
</div>
);
}


const Mechanics = () => <div><h2>Mechanics</h2></div>;
const ServiceTracking = () => <div><h2>Service Tracking</h2></div>;
const Appointments = () => <div><h2>Appointments</h2></div>;
const CustomerList = () => <div><h2>Customer List</h2></div>;
const ServicePricing = () => <div><h2>Service Pricing</h2></div>;
const Footer = () => (
  <footer>
    <p> Contact: </p>
    <p>dm26690@georgiasouthern.edu</p>
    <p>vl02201@georgiasouthern.edu</p>
  </footer>
);


// main app component
const App = () => {
  return (
    <><Router>
      <div>
        <nav>
          <ul>
            <li> <Link to="/home">Home</Link></li>
            <li><Link to="/mechanics">Mechanics</Link></li>
            <li><Link to="/service-tracking">Service Tracking</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/customer-list">Customer List</Link></li>
            <li><Link to="/service-pricing">Service Pricing</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/service-tracking" element={<ServiceTracking />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/service-pricing" element={<ServicePricing />} />
          {/* Redirect to mechanics as a default */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router><Footer> </Footer></>
  );


  


  
};

export default App;
