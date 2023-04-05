import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuestionPage(props) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const userEmail = localStorage.getItem('userEmail');
  const { requestId } = useParams();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get(`http://localhost:5000/api/questions?userEmail=${userEmail}&requestId=${requestId}`);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error(error);
      }
    }
    if (userEmail) {
      fetchQuestions();
    }
  }, [userEmail, requestId]);

  const handleAnswerChange = (event, question_id) => {
    setAnswers({
      ...answers,
      [question_id]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/answers`, {
        userEmail: userEmail,
        requestId: requestId,
        answers: answers,
        question_ids: Object.keys(answers)
      });
      if (response.status === 200) {
        alert(response.data.message);
        //window.location.href = '/developerportal';
      } else {
        alert('Failed to Submit Answers');
        console.error('Failed to Submit Answers:', response.status);
      }
      // redirect to success page
    } catch (error) {
      console.error(error);
    }
    
  };

  return (
    <div>
      <h1>Question Page</h1>
      <form onSubmit={handleSubmit}>
        <ol>
          {questions.map((question, index) => (
            <li key={question.question_id}>
              <p>{question.question}</p>
              <div className="answer">
                <input 
                  type="text" 
                  value={answers[question.question_id] || ''} 
                  onChange={(event) => handleAnswerChange(event, question.question_id)}
                  style={{
                    display: 'inline-block',
                    width: '70%',
                    height: '1.5em',
                    padding: '0.5em',
                    margin: '0 0.5em',
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
  
  
}

export default QuestionPage;
