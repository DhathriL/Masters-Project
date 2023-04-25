import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import QuestionAnswerPage from './QuestionAnswerPage';

function SentRequests() {
  const [sentRequests, setsentRequests] = useState([]);

  useEffect(() => {
    async function fetchsentRequests() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/SentRequests', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setsentRequests(response.data.sentRequests);
      } catch (error) {
        console.error(error);
      }
    }
    fetchsentRequests();
  }, []);

  return (
    <Router>
      <div className="container">
        <div className="header">
        <h4>Requirements Questionnaire Tool</h4>
        <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.reload(); window.location.href = '/'; }}>Logout</button>
        </div>
        <br /><br />
      <h3>Updated Requests</h3>
      {sentRequests.length > 0 ? (
        <ul>
        {sentRequests.map(request => (
          <li key={request.request_id}>
            <p>To: {request.to_email}</p>
            <p>Sent date & time: {request.created_date}</p>
            <p>Updated date & time: {request.updated_date}</p>
            <p>
                  Request :{' '}
                  <Link to={{ 
                    pathname: `/SentRequests/${request.request_id}`, 
                    state: { requestId: request.request_id } }} >
                    {request.url}
                  </Link>
                </p>
            <p>URL: {request.url}</p>
          </li>
        ))}
      </ul>
      ) : (
        <div>No requests found.</div>
      )}
      
      
      <Switch>
        <Route path="/SentRequests/:requestId">
          <QuestionAnswerPage />
        </Route>
      </Switch>
    </div>
    </Router>
    
    
  );
}

export default SentRequests;
