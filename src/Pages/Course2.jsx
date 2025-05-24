import Top from '../components/Top'
import Footer1 from '../components/Footer1';
import "../styles.css";
import { useState } from 'react';

export default function Course1() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState(Array(15).fill(null));

  const exam = {
    type: 'exam',
    title: 'Exam: Park Guide Mastery',
    duration: 3600, // 60 minutes in seconds
    course: 'Park Guide Mastery',
    questions: [
      {
        question: 'Q1: What is the primary role of a park guide?',
        options: [
          { label: 'A) To patrol the park and issue fines', value: 'A' },
          { label: 'B) To educate visitors about the environment and wildlife', value: 'B' },
          { label: 'C) To sell tickets', value: 'C' },
          { label: 'D) To build new trails', value: 'D' },
        ],
        correct: 'B',
      },
      {
        question: 'Q2: What skill is most important for park guides?',
        options: [
            { label: 'A) Accounting', value: 'A' },
            { label: 'B) Programming', value: 'B' },
            { label: 'C) Communication', value: 'C' },
            { label: 'D) Carpentry', value: 'D' },
        ],
        correct: 'C',
    },
    {
        question: 'Q3: Which of these is a key responsibility of a park guide?',
        options: [
            { label: 'A) Enforcing federal laws', value: 'A' },
            { label: 'B) Organizing guided tours', value: 'B' },
            { label: 'C) Planting trees', value: 'C' },
            { label: 'D) Driving tourists', value: 'D' },
        ],
        correct: 'B',
    },
    {
        question: 'Q4: What kind of knowledge should a park guide possess?',
        options: [
            { label: 'A) Local ecology and history', value: 'A' },
            { label: 'B) Cryptocurrency trends', value: 'B' },
            { label: 'C) Airline regulations', value: 'C' },
            { label: 'D) City traffic rules', value: 'D' },
        ],
        correct: 'A',
    },
    {
        question: 'Q5: Which of the following would a park guide most likely use?',
        options: [
            { label: 'A) Microscope', value: 'A' },
            { label: 'B) Map and compass', value: 'B' },
            { label: 'C) Medical scanner', value: 'C' },
            { label: 'D) Radar gun', value: 'D' },
        ],
        correct: 'B',
    },
    {
        question: 'Q6: How should a park guide manage a group of visitors on a hike?',
        options: [
            { label: 'A) Allow them to wander freely', value: 'A' },
            { label: 'B) Keep the group together, guiding them along a safe route', value: 'B' },
            { label: 'C) Split them into smaller groups without supervision', value: 'C' },
            { label: 'D) Have them follow a set pace regardless of their experience', value: 'D' },
        ],
        correct: 'B',
    },
    {
        question: 'Q7: What is the best way for a park guide to handle an injured visitor?',
        options: [
            { label: 'A) Administer first aid and call for help', value: 'A' },
            { label: 'B) Leave them in place and wait for emergency services', value: 'B' },
            { label: 'C) Ask the visitor to walk it off', value: 'C' },
            { label: 'D) Ignore the injury if it seems minor', value: 'D' },
        ],
        correct: 'A',
    },
    {
        question: 'Q8: What should a park guide do if they encounter an aggressive animal?',
        options: [
            { label: 'A) Try to scare the animal away', value: 'A' },
            { label: 'B) Remain calm and slowly back away', value: 'B' },
            { label: 'C) Approach the animal and try to calm it down', value: 'C' },
            { label: 'D) Run away quickly', value: 'D' },
        ],
        correct: 'B',
    },
    {
        question: 'Q9: How should a park guide respond if a visitor is lost?',
        options: [
            { label: 'A) Tell the visitor to find their own way back', value: 'A' },
            { label: 'B) Call for assistance and stay with the visitor until help arrives', value: 'B' },
            { label: 'C) Leave them alone to figure it out', value: 'C' },
            { label: 'D) Direct them to the nearest road and tell them to flag down a car', value: 'D' },
        ],
        correct: 'B',
    },
    {
        question: 'Q10: What environmental principle should a park guide follow when interacting with nature?',
        options: [
            { label: 'A) Pick flowers to show visitors', value: 'A' },
            { label: 'B) Leave no trace and minimize the human footprint', value: 'B' },
            { label: 'C) Encourage visitors to take souvenirs from the park', value: 'C' },
            { label: 'D) Build campfires in the woods for visitors to enjoy', value: 'D' },
        ],
        correct: 'B',
    },
    {
        question: 'Q11: If a park guide notices a fire in the area, what should they do?',
        options: [
            { label: 'A) Ignore it and continue with the tour', value: 'A' },
            { label: 'B) Evacuate visitors and alert authorities', value: 'B' },
            { label: 'C) Try to put the fire out themselves', value: 'C' },
            { label: 'D) Take a picture for social media', value: 'D' },
        ],
        correct: 'B',
    },
    {
        question: 'Q12: How can a park guide improve their communication with visitors?',
        options: [
            { label: 'A) Use technical jargon to impress them', value: 'A' },
            { label: 'B) Speak clearly, listen actively, and engage with their questions', value: 'B' },
            { label: 'C) Talk only about the park’s rules', value: 'C' },
            { label: 'D) Be silent and just guide the group through the park', value: 'D' },
        ],
        correct: 'B',
    },
    {
        question: 'Q13: What is a common hazard park guides should be aware of during a hike?',
        options: [
            { label: 'A) Thunderstorms and lightning', value: 'A' },
            { label: 'B) High-speed internet access', value: 'B' },
            { label: 'C) Strong winds at the park entrance', value: 'C' },
            { label: 'D) Too many visitors on the trail', value: 'D' },
        ],
        correct: 'A',
    },
    {
        question: 'Q14: How should a park guide deal with a visitor who is behaving disruptively?',
        options: [
            { label: 'A) Ask them to leave the park immediately', value: 'A' },
            { label: 'B) Ignore their behavior and continue', value: 'B' },
            { label: 'C) Calmly address the behavior and explain the rules', value: 'C' },
            { label: 'D) Call for the park ranger to handle the situation', value: 'D' },
        ],
        correct: 'C',
    },
    {
        question: 'Q15: What should a park guide do after completing a tour with visitors?',
        options: [
            { label: 'A) Leave the group without saying anything', value: 'A' },
            { label: 'B) Thank the visitors, offer additional information, and ensure they have a safe way to leave', value: 'B' },
            { label: 'C) Encourage them to stay longer without any guidance', value: 'C' },
            { label: 'D) Take a break and not communicate with the group again', value: 'D' },
        ],
        correct: 'B',
    },
    ],
  };

  const handleOptionSelect = (optionValue) => {
    setSelectedOption(optionValue);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionValue;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedOption === exam.questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setSelectedOption('');
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1]);
    }
  };

  const restartExam = () => {
    setCurrentQuestion(0);
    setSelectedOption('');
    setScore(0);
    setShowResult(false);
    setAnswers(Array(15).fill(null));
  };

  return (
    <>
      <Top />
      <div className="exam-container">
        <h1 className="exam-title">{exam.title}</h1>
        <p className="exam-course">Course: {exam.course}</p>
        <p className="exam-duration">Duration: {Math.floor(exam.duration / 60)} minutes</p>

        {!showResult ? (
          <div className="question-container">
            <h2 className="question-text">
              {exam.questions[currentQuestion].question}
            </h2>
            <div className="options-container">
              {exam.questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${selectedOption === option.value ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
            <div className="navigation-buttons">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={!selectedOption}
              >
                {currentQuestion === exam.questions.length - 1 ? 'Finish Exam' : 'Next'}
              </button>
            </div>
            <div className="progress">
              Question {currentQuestion + 1} of {exam.questions.length}
            </div>
          </div>
        ) : (
          <div className="result-container">
            <h2>Exam Results</h2>
            <p className="score">
              You scored {score} out of {exam.questions.length} (
              {Math.round((score / exam.questions.length) * 100)}%)
            </p>
            <button onClick={restartExam} className="restart-button">
              Retake Exam
            </button>
          </div>
        )}
      </div>
      <footer>
        <Footer1 />
      </footer>
    </>
  );
}