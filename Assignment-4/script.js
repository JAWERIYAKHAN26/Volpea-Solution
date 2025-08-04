const startPage = document.getElementById("start-page");
const quizContainer = document.getElementById("quiz-container");
const resultPage = document.getElementById("result-page");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreDisplay = document.getElementById("score-display");
const timerDisplay = document.getElementById("timer");

const finalScore = document.getElementById("final-score");
const percentageDisplay = document.getElementById("percentage");
const timeUsedDisplay = document.getElementById("time-used");

let questions = [
  {question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris"},
  {question: "Which is the largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter"},
  {question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci"], answer: "Da Vinci"},
  {question: "What is 5 + 7?", options: ["10", "11", "12"], answer: "12"},
  {question: "Which language is used for web apps?", options: ["Python", "JavaScript", "C++", "Java"], answer: "JavaScript"}
];

let shuffledQuestions, currentQuestionIndex, score, timer, timeLeft = 50;

// Start Quiz
function startQuiz() {
  startPage.classList.remove("active");
  resultPage.classList.remove("active");
  quizContainer.classList.add("active");

  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 50;
  scoreDisplay.textContent = `Score: ${score}`;

  startTimer();
  showQuestion();
}

// Timer
function startTimer() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

// Show Question
function showQuestion() {
  nextBtn.disabled = true;
  const questionData = shuffledQuestions[currentQuestionIndex];
  questionElement.textContent = questionData.question;
  optionsElement.innerHTML = "";

  questionData.options.sort(() => Math.random() - 0.5).forEach(option => {
    const button = document.createElement("div");
    button.classList.add("option");
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(button, questionData.answer));
    optionsElement.appendChild(button);
  });
}

// Handle Answer Selection
function selectAnswer(selected, correctAnswer) {
  const options = document.querySelectorAll(".option");
  options.forEach(option => {
    option.style.pointerEvents = "none";
    if (option.textContent === correctAnswer) option.classList.add("correct");
  });

  if (selected.textContent === correctAnswer) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  } else {
    selected.classList.add("wrong");
  }

  nextBtn.disabled = false;
}

// Next Question
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

// End Quiz
function endQuiz() {
  clearInterval(timer);
  quizContainer.classList.remove("active");
  resultPage.classList.add("active");

  const totalQuestions = shuffledQuestions.length;
  const percent = Math.round((score / totalQuestions) * 100);
  const timeTaken = 50 - timeLeft;

  finalScore.textContent = `Your Score: ${score}/${totalQuestions}`;
  percentageDisplay.textContent = `Percentage: ${percent}%`;
  timeUsedDisplay.textContent = `Time Used: ${timeTaken}s`;
}

// Restart Quiz
restartBtn.addEventListener("click", startQuiz);
startBtn.addEventListener("click", startQuiz);
