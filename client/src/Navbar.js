//import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
//import axios from 'axios';

function Navbar() {
  const history = useHistory();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      localStorage.removeItem('token');
      history.push('/');
    }
  };

  return (
    <nav>
      <ul>
        <li><Link to="/SentRequests" style={{ color: 'white' }}>Updated Requests</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
