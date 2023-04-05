import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import QuestionPage from './QuestionPage';

function ClientPortal(props) {
  const [requests, setRequests] = useState([]);
  const userEmail = localStorage.getItem('userEmail');
  //const { requestId } = useParams();

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get(`http://localhost:5000/api/requests?userEmail=${userEmail}`);
        setRequests(response.data.requests);
        //requestId = response.data.requests.request_id;
        //console.log("request_id:",request_id);
      } catch (error) {
        console.error(error);
      }
    }

    if (userEmail) {
      fetchRequests();
    }
  }, [userEmail]);

  if (!userEmail) {
    return <div>Please provide an email address to view your requests.</div>;
  }

  return (
    <Router>
      <div>
        <h1>Welcome to client portal</h1>
        <h2>Your Requests:</h2>
        {requests.length > 0 ? (
          <ol>
            {requests.map((request, index) => (
              <li key={request.request_id}>
                <p>
                  <strong>Request Details</strong>:
                </p>
                <p>From: {request.from_email}</p>
                <p>
                  Question Link:{' '}
                  <Link to={{ 
                    pathname: `/requests/${request.request_id}`, 
                    state: { requestId: request.request_id } }} >
                    {request.url}
                  </Link>
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <div>No requests found.</div>
        )}

        <Switch>
          <Route path="/requests/:requestId">
            <QuestionPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default ClientPortal;
