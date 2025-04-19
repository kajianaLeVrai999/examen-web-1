let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let totalTypedChars = 0;
let totalCorrectChars = 0;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

const startTest = (wordCount = 50) => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    totalTypedChars = 0;
    totalCorrectChars = 0;
    wpmDisplay.textContent = "";
    accuracyDisplay.textContent = "";

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
};

const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000;
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60);

    const accuracy = (totalCorrectChars / totalTypedChars) * 100;
    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
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
        }

        inputField.value = "";
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
    }
};

inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});

modeSelect.addEventListener("change", () => startTest());

startTest();