let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let totalTypedChars = 0;
let totalCorrectChars = 0;
let mistakeCount = 0;
let timeLeft = 60;
let timerInterval = null;
let timerStarted = false;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const mistakeDisplay = document.getElementById("mistakes");
const replayButton = document.getElementById("replay-btn");
const timerDisplay = document.getElementById("timer");

const words = {
  easy: [
    "the", "and", "run", "jump", "play", "bit", "coin", "fire",
    "go", "stop", "hit", "high", "low", "up", "down", "win", "loss", "game", "retro"
  ],
  medium: [
    "arcade", "enemy", "insert", "credit", "pixels", "freeze", "combo", "attack",
    "reload", "mission", "glitch", "console", "upgrade", "danger", "sprite",
    "virtual", "restart", "powerup", "press", "rewind"
  ],
  hard: [
    "the", "from", "while", "without", "controller", "multiplayer",
    "checkpoint", "leaderboard", "achievement", "synchronization",
    "difficulty", "respawning", "interaction", "gameplayer", "retroverse"
  ]
};

const getRandomWord = (mode) => {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
};

const startCountdown = () => {
  timeLeft = 60;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      inputField.disabled = true;
      results.style.display = "block";
    }
  }, 1000);
};

const startTest = (wordCount = 50) => {
  wordsToType.length = 0;
  wordDisplay.innerHTML = "";
  currentWordIndex = 0;
  startTime = null;
  previousEndTime = null;
  totalTypedChars = 0;
  totalCorrectChars = 0;
  mistakeCount = 0;

  wpmDisplay.textContent = "wpm: 0 ";
  accuracyDisplay.textContent = "accuracy: 100%";
  mistakeDisplay.textContent = "Mistakes: 0";

  for (let i = 0; i < wordCount; i++) {
    wordsToType.push(getRandomWord(modeSelect.value));
  }

  wordsToType.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    if (index === 0) span.style.color = "black";
    wordDisplay.appendChild(span);
  });

  inputField.value = "";
  inputField.disabled = false;
  results.style.display = "none";
  timerStarted = false;
};

const startTimer = () => {
  if (!timerStarted) {
    startCountdown();
    timerStarted = true;
  }

  if (!startTime) startTime = Date.now();
};

const getCurrentStats = () => {
  const elapsedTime = (Date.now() - previousEndTime) / 1000;
  const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60);
  const accuracy = (totalCorrectChars / totalTypedChars) * 100;
  return {
    wpm: wpm.toFixed(2),
    accuracy: accuracy.toFixed(2)
  };
};

const updateWord = (event) => {
  if (event.key === " ") {
    const typed = inputField.value.trim();
    const expected = wordsToType[currentWordIndex];
    if (!previousEndTime) previousEndTime = startTime;

    totalTypedChars += typed.length;
    for (let i = 0; i < Math.min(typed.length, expected.length); i++) {
      if (typed[i] === expected[i]) totalCorrectChars++;
    }

    const { wpm, accuracy } = getCurrentStats();
    wpmDisplay.textContent = `WPM: ${wpm}`;
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;

    if (typed === expected) {
      currentWordIndex++;
      previousEndTime = Date.now();
      highlightNextWord();
    } else {
      mistakeCount++;
      mistakeDisplay.textContent = `Mistakes: ${mistakeCount}`;
    }

    inputField.value = "";
    inputField.focus();
    event.preventDefault();
  }
};

const highlightNextWord = () => {
  const wordElements = wordDisplay.children;

  if (currentWordIndex < wordElements.length) {
    if (currentWordIndex > 0) {
      wordElements[currentWordIndex - 1].style.color = "#f4f4f9";
    }
    wordElements[currentWordIndex].style.color = "black";
  } else if (currentWordIndex === wordElements.length) {
    wordElements[currentWordIndex - 1].style.color = "#f4f4f9";
  }
};

inputField.addEventListener("keydown", (event) => {
  startTimer();
  updateWord(event);
});

modeSelect.addEventListener("change", () => startTest());

replayButton.addEventListener("click", () => {
  clearInterval(timerInterval); 
  timerStarted = false;         
  startTest();                 
});

startTest();
