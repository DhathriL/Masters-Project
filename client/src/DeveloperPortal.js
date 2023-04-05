import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function ClientPortal() {
  const [send_to, setSendTo] = useState('');
  const [stakeholderNames, setStakeholderNames] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [questions, setQuestions] = useState([]);
  const history = useHistory();

  useEffect(() => {
    //const token = localStorage.getItem('token');
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/stakeholderNames');
        setStakeholderNames(response.data.stakeholderNames);//setRequests(response.data.requests);
        //requestId = response.data.requests.request_id;
        //console.log("request_id:",request_id);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const handleSendToChange = (event) => {
    setSendTo(event.target.value);
  };

  const handleNameChange = async (event) => {
    const name = event.target.value;
    setSelectedName(name);
    console.log("name e:",name);

    //const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:5000/questions?name=${name}`);
      setQuestions(response.data.questions);//setRequests(response.data.requests);
      //requestId = response.data.requests.request_id;
      //console.log("request_id:",request_id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Selected name:', selectedName);
    console.log('Questions:', questions);
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/sendRequests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        send_to,
        stakeholderName: selectedName,
        questions
      })
    });

    if (response.ok) {
      alert('Request sent!');
      send_to ='';
      setSelectedName('');
      setQuestions([]);
      history.push('/DeveloperPortal');
    } else {
      alert('Failed to send request.');
      console.error('Failed to send request:', response.status);
    }
  };

  return (
    <div>
      <h1>Welcome to developer portal</h1>
      <form onSubmit={handleSubmit}>
      <label>
          Send to:
          <input type="email" name ='send_to' value={send_to} onChange={handleSendToChange} required />
        </label>
        <br />
        <label>
          Select stakeholder name:
          <select value={selectedName} onChange={handleNameChange} required>
            <option value="">-- Please select --</option>
            {stakeholderNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
        <br />
        {questions.length > 0 &&
          <div>
            <h2>Questions:</h2>
            <ul>
              {questions.map(question => (
                <li key={question.question_id}>{question.question}</li>
              ))}
            </ul>
          </div>
        }
        <button type="submit" disabled={!selectedName || questions.length === 0}>Submit request</button>
        <button type="button" onClick={() => { setSelectedName(''); setQuestions([]); }}>Cancel</button>
      </form>
    </div>
  );
}

export default ClientPortal;
