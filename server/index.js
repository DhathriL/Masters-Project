
//import React from 'react';
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const shortid = require('shortid');
const cookieParser = require('cookie-parser');
//const ReactDOMServer = require('react-dom/server');//for sendind a request from dev to client
const app = express();
// Secret key for JWT
//const secretKey = 'your_secret_key';
// Create connection to MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'rc_project', // Replace with the name of your database
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Generate unique ID for each request
const generateRequestId = () => shortid.generate();

// Login endpoint
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT role_name FROM user_profiles WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const { role_name } = results[0];
      const token = jwt.sign({ email, role_name }, 'your-secret-key');
      console.log("token1",token);
      res.json({ token, role_name });
    }
  });
});

// Send requests endpoint
app.post('/sendRequests', (req, res) => {
  const { send_to, stakeholderName } = req.body;
  const query = `SELECT question FROM rc_questions WHERE role_name = '${stakeholderName}'`;
  console.log("email_to:1",send_to);
  // Extract the token from the Authorization header
  //const authHeader = req.headers['authorization'];
  //const token = authHeader && authHeader.split(' ')[1];
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid Authorization header' });
  }
  const token = authHeader.slice(7); // Extract the token from the Authorization header


  console.log("token2",token);
  
  if (!token) {
    return res.status(401).json({ message: 'You are not authorized to send requests' });
  }
  console.log("email_to:3",send_to);

  // Verify the token and extract the email and role name
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
  
    console.log("email_to:4",send_to);

    const { email, role_name } = decoded;
    const from_email = email;
    console.log("email_to:5",from_email);

    // TODO: Send request to client portal using some kind of messaging service
    const requestId = generateRequestId();
    const query1 = 'INSERT INTO rc_requests (request_id, from_email, to_email, to_stakeholder, url, created_date) VALUES (?, ?, ?, ?, ?, NOW())';
    const url = `http://localhost:5000/clientPortal/${requestId}`;
    connection.query(query1, [requestId, from_email, send_to, stakeholderName, url], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send questions' });
      } else {
        res.json({  message: `Questions sent successfully to ${send_to}` });
      }
    });
  });
});
app.get('/stakeholderNames', (req, res) => {
  const query = 'SELECT DISTINCT role_name FROM rc_questions';
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch stakeholders' });
    } else {
      const stakeholderNames = results.map(result => result.role_name);
      res.json({ stakeholderNames });
    }
  });
});
app.post('/questions', (req, res) => {
  const { name } = req.query;
  console.log("name:", name);
  const query = 'SELECT question_id, question FROM rc_questions WHERE role_name = ?';
  connection.query(query, [name], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch questions' });
    } else {
      //const questions = results.map(result => result.question);
      //res.json({ questions });
      res.json({ questions: results });
    }
  });
});

// Endpoint to get requests for a client
app.get('/api/requests', (req, res) => {
  const { userEmail } = req.query;
  console.log('email1:',userEmail);
  const query = 'SELECT request_id, from_email, url FROM rc_requests WHERE to_email = ?';
  connection.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch requests' });
    } else {
      res.json({ requests: results });
    }
  });
});

// Endpoint to get questions for a stakeholder
app.get('/api/questions', (req, res) => {
  const { userEmail, requestId } = req.query;
  console.log('email2:',userEmail);
  const query = 'select question_id, question from rc_questions, rc_requests where to_email = ? and to_stakeholder = role_name and request_id = ?;';
  connection.query(query, [userEmail, requestId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch questions' });
    } else {
      res.json({ questions: results });
    }
  });
});

// Endpoint to save answers for a request
app.post('/api/answers', (req, res) => {
  const { userEmail, requestId, answers, question_ids } = req.body;
  const query = 'INSERT INTO rc_answers (answer, question_id, answered_by, request_id) VALUES ?';
  const values = Object.entries(answers).map(([question_id, answer]) => [answer, question_id, userEmail, requestId]);
  connection.query(query, [values], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to save answers' });
    } else {
      res.json({ message: 'Answers saved successfully' });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
