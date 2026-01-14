// script.js

const questions = [
  {
    question: "A patron is found on the floor, what is the first thing you do?",
    choices: [
      "Check for responsiveness",
      "Radio call building supervisor",
      "Put on PPE",
      "Check scene for safety",
    ],
    answer: "Check scene for safety",
  },
  {
    question: "After checking for safety, you:",
    choices: ["Put on PPE", "Start CPR", "Call EMS", "Leave the area"],
    answer: "Put on PPE",
  },
  {
    question: "PPE is on, now you:",
    choices: ["Check for responsiveness", "Radio call", "Start compressions"],
    answer: "Check for responsiveness",
  },
  {
    question: "Patron is unresponsive, so you make a radio call. What do you ask the building supervisor to bring?",
    choices: ["AED & First Aid", "Band-Aids", "AED", "First Aid kit"],
    answer: "AED & First Aid",
  },
  {
    question: "When making a radio call, who calls EMS?",
    choices: ["Welcome desk", "Member services", "Building supervisor", "911"],
    answer: "Member services",
  },
  {
    question: "Who calls UHPD?",
    choices: ["Welcome desk", "Member services", "Building supervisor", "911"],
    answer: "Welcome desk",
  },
  {
    question: "How many compressions and breaths are you giving?",
    choices: ["20,2", "30,2", "15,1"],
    answer: "30,2",
  },
  {
    question: "How many Beats Per Minute are the compressions?",
    choices: ["90-100 BPM", "100-110 BPM", "100-120 BPM"],
    answer: "100-120 BPM",
  },
  {
    question: "AED has now arrived, how will you place the pads?",
    choices: [
      "Upper Right Side & Lower Left Side",
      "Top Left Side & Bottom Left Side",
      "On the front & on the back",
    ],
    answer: "Top right & left side under armpit",
  },
  {
    question: "AED is now analyzing, what do you do?",
    choices: ["Stand clear", "Continue compressions", "Wait for the shock to be delivered"],
    answer: "Stand clear",
  },
];

let currentQuestion = 0;
let userName = "";
let score = 0;
let submitted = false;

const introEl = document.getElementById("intro");
const startBtn = document.getElementById("start-btn");
const nameInput = document.getElementById("name-input");

const quizEl = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

const progressBar = document.getElementById("progress-bar");

startBtn.addEventListener("click", () => {
  userName = nameInput.value.trim();
  if (!userName) {
    alert("Please enter your name.");
    return;
  }

  introEl.style.display = "none";
  quizEl.style.display = "block";

  currentQuestion = 0;
  score = 0;
  submitted = false;

  showQuestion();
  updateProgress();
});

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;

  choicesEl.innerHTML = "";
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";

  q.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(choice);
    choicesEl.appendChild(btn);
  });
}

function selectAnswer(choice) {
  const correct = questions[currentQuestion].answer;

  Array.from(choicesEl.children).forEach((btn) => (btn.disabled = true));

  if (choice === correct) {
    score++;
    feedbackEl.textContent = "✅ Correct.";
  } else {
    feedbackEl.textContent = `❌ Incorrect. Correct answer: ${correct}`;
  }

  Array.from(choicesEl.children).forEach((btn) => {
    if (btn.textContent === correct) btn.classList.add("correct");
    if (btn.textContent === choice && choice !== correct) btn.classList.add("wrong");
  });

  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  updateProgress();

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showCompletion();
  }
});

function updateProgress() {
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
}

function showCompletion() {
  questionEl.textContent = "Practice Complete";
  choicesEl.innerHTML = "";
  progressBar.style.width = "100%";
  nextBtn.style.display = "none";

 const total = questions.length;

if (score === total) {
  feedbackEl.innerHTML = `
    <strong>Name:</strong> ${userName}<br>
    <strong>Score:</strong> ${score} / ${total}<br>
    🎉 You passed.
  `;
} else {
  feedbackEl.innerHTML = `
    <strong>Name:</strong> ${userName}<br>
    <strong>Score:</strong> ${score} / ${total}<br>
    ⚠️ You must score 100% to pass. Please retake the practice.
  `;
}


  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Retake Practice";
  restartBtn.style.marginTop = "15px";
  restartBtn.style.padding = "12px";
  restartBtn.style.fontSize = "18px";
  restartBtn.style.backgroundColor = "#8b0000";
  restartBtn.style.color = "white";
  restartBtn.style.border = "none";
  restartBtn.style.borderRadius = "8px";
  restartBtn.style.cursor = "pointer";
  restartBtn.style.width = "100%";

  restartBtn.onclick = () => {
    currentQuestion = 0;
    score = 0;
    submitted = false;
    progressBar.style.width = "0%";
    showQuestion();
    updateProgress();
  };

  choicesEl.appendChild(restartBtn);

  if (submitted) return;
  submitted = true;

  fetch("https://script.google.com/macros/s/AKfycbyw19SxQszCm60akDZikZTgYc5sdXes8trFkm_xbVrjS7buQuMvdb0H5DhOe9BZ3NA0/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: userName,
      score: `${score}/${total}`,
      passed: score === total ? "YES" : "NO",
      timestamp: new Date().toISOString(),
    }),
  });
}

