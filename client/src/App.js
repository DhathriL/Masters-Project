import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './SignIn';
import Developer from './DeveloperPortal';
import Client from './ClientPortal';
import QuestionPage from './QuestionPage';
import SentRequests from './SentRequests';
import QuestionAnswerPage from './QuestionAnswerPage';
//import Logout from './Logout';
//import Navbar from './Navbar';

function App() {
  return (
    <Router>
      
      <Switch>
        <Route exact path="/">
          <SignIn />
        </Route>
        <Route path="/DeveloperPortal">
          <Developer />
        </Route>
        <Route path="/SentRequests">
          <SentRequests />
        </Route>
        <Route path="/ClientPortal">
          <Client />
        </Route>
        <Route path="/QuestionPage/:id">
          <QuestionPage />
        </Route>
        <Route path="/SentRequests/:id">
          <QuestionAnswerPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
