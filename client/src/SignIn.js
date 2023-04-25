import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './App.css';

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    localStorage.setItem('userEmail', email);
    try {
      //console.log('Email:', email);
      //console.log('Password:', password);
      const response = await fetch("http://localhost:5000/signin", 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });   
      const { token, role_name } = await response.json();
      localStorage.setItem('token', token);
      console.log(token); 
      if (role_name.startsWith('Client')) {
        history.push('/ClientPortal');
      } else if (role_name.startsWith('Dev')) {
        history.push('/DeveloperPortal');
      }
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.');
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="header">
      <h4>Requirements Questionnaire Tool</h4>
      </div>
      <h2>Sign In</h2>
      <div class="login">
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label><b>Email:</b>
          <input type="email" name="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email"/>
        </label>
        <br />
        <br />
        <label><b>Password:</b>
          <input type="password" name="password" id="pass" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password"/>
        </label>
        <br /><br /><br />
        <button type="submit" class="center">Sign In</button>
      </form>
      </div>
    </div>
  );
}

export default SignIn;