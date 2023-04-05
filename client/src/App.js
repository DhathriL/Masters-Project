import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './SignIn';
import Developer from './DeveloperPortal';
import Client from './ClientPortal';
import QuestionPage from './QuestionPage';

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
        <Route path="/ClientPortal">
          <Client />
        </Route>
        <Route path="/QuestionPage/:id">
          <QuestionPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
