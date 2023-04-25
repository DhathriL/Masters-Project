import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import jsPDF from 'jspdf';

function QuestionAnswerPage(props) {
  const [questions, setQuestions] = useState([]);
  const userEmail = localStorage.getItem('userEmail');
  const { requestId } = useParams();
  const history = useHistory();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(userEmail);
        const response = await axios.post(`http://localhost:5000/api/QuesAns?userEmail=${userEmail}`, { requestId });
        setQuestions(response.data.questions);
        console.log(response.data.questions)
      } catch (error) {
        console.error(error);
      }
    }
    if (userEmail) {
      fetchQuestions();
    }
  }, [userEmail, requestId]);

  const handleBack = () => {
    history.goBack();
  }
  const handleDownload = () => {
    const doc = new jsPDF();
    const lineHeight = 7;
    const maxWidth = 180; // maximum width of text in PDF
    const maxHeight = 250; // maximum height of text in PDF
    let startY = 20; // starting y position of text
    let currentHeight = 0; // current height of the text
  
    // iterate over questions and answers
    questions.forEach((question, index) => {
      const label = `${index + 1}. ${question.question}`;
      const answer = `Answer: ${question.answer}`;
  
      // split label and answer into lines that fit within maxWidth
      const labelLines = doc.splitTextToSize(label, maxWidth);
      const answerLines = doc.splitTextToSize(answer, maxWidth);
  
      // calculate total height of label and answer
      const totalHeight = (labelLines.length + answerLines.length) * lineHeight;
  
      // if the label and answer won't fit on the current page, add a new page
      if (currentHeight + totalHeight > maxHeight) {
        doc.addPage();
        startY = 20;
        currentHeight = 0;
      }
  
      // print label and answer to PDF
      labelLines.forEach(line => {
        doc.text(line, 10, startY);
        startY += lineHeight;
      });
      answerLines.forEach(line => {
        doc.text(line, 10, startY);
        startY += lineHeight;
      });
  
      currentHeight += totalHeight;
      startY += lineHeight; // add extra space between questions
    });
  
    // save the PDF
    doc.save('question_answers.pdf');
  };
  
  
  
   

  return (
    <div>
      <h2>Question Answer Page</h2>
        <ol>
          {questions.map((question, index) => (
            <li key={index}>
              <p>{question.question}</p>
              <p>{question.answer}</p>
            </li>
          ))}
        </ol>
        <button type="back" onClick={handleBack}>Back</button>
        <button type="button" onClick={handleDownload}>Download PDF</button>
    </div>
  );
}

export default QuestionAnswerPage;
