import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

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
    <div>
      <h1>Sign In</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;