import { push, ref, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "../firebase.js";

/* =================================
   SKILLSTRACK MEMORY GAME
   ================================= */


/* =================================
   GAME VARIABLES
   ================================= */

var sequence = [];

var playerSequence = [];

var level = 0;

var score = 0;

var highScore = localStorage.getItem("skillsTrackMemoryHighScore") || 0;

var isPlaying = false;

var isShowingSequence = false;


/* =================================
   HTML ELEMENTS
   ================================= */

var buttons = document.querySelectorAll(".memory-button");

var startButton = document.getElementById("start-button");

var levelDisplay = document.getElementById("level");

var scoreDisplay = document.getElementById("score");

var highScoreDisplay = document.getElementById("high-score");

var statusDisplay = document.getElementById("status");

var gameOverDisplay = document.getElementById("game-over");

var finalScoreDisplay = document.getElementById("final-score");

function getCurrentLearner() {
    try {
        return JSON.parse(localStorage.getItem("skillsTrackCurrentUser") || "{}");
    } catch (error) {
        return {};
    }
}

async function saveGameResult() {
    const learner = getCurrentLearner();
    const learnerUid = auth.currentUser?.uid || learner.uid || "guest";
    const learnerEmail = auth.currentUser?.email || learner.email || "";
    const learnerName = learner.fullName || `${learner.firstName || ""} ${learner.lastName || ""}`.trim() || "Learner";

    try {
        await push(ref(db, "gameResults"), {
            learnerUid,
            learnerEmail,
            learnerName,
            score,
            level,
            bestScore: highScore,
            completedAt: serverTimestamp(),
            source: "memory-game"
        });
    } catch (error) {
        console.error("Failed to save game result:", error);
    }
}

/* =================================
   DISPLAY INITIAL HIGH SCORE
   ================================= */

highScoreDisplay.textContent = highScore;


/* =================================
   START GAME
   ================================= */

startButton.addEventListener("click", function () {
    startGame();
});


function startGame() {

    sequence = [];

    playerSequence = [];

    level = 0;

    score = 0;

    isPlaying = true;

    isShowingSequence = false;

    levelDisplay.textContent = level;

    scoreDisplay.textContent = score;

    statusDisplay.textContent = "Get ready...";

    gameOverDisplay.classList.add("hidden");

    startButton.classList.add("hidden");

    disableButtons();

    setTimeout(function () {
        nextRound();
    }, 1000);
}


/* =================================
   START NEXT ROUND
   ================================= */

function nextRound() {

    playerSequence = [];

    level++;

    levelDisplay.textContent = level;

    statusDisplay.textContent = "Watch the sequence...";

    disableButtons();

    addRandomButton();

    showSequence();
}


/* =================================
   ADD RANDOM BUTTON
   ================================= */

function addRandomButton() {

    var colors = [
        "green",
        "red",
        "yellow",
        "blue"
    ];

    var randomNumber = Math.floor(
        Math.random() * colors.length
    );

    var randomColor = colors[randomNumber];

    sequence.push(randomColor);
}


/* =================================
   SHOW THE SEQUENCE
   ================================= */

function showSequence() {

    isShowingSequence = true;

    var currentIndex = 0;

    var speed = Math.max(300, 650 - (level * 15));

    var interval = setInterval(function () {

        if (currentIndex >= sequence.length) {

            clearInterval(interval);

            isShowingSequence = false;

            enableButtons();

            statusDisplay.textContent =
                "Your turn - repeat the sequence.";

            return;
        }

        var color = sequence[currentIndex];

        flashButton(color);

        currentIndex++;

    }, speed);
}


/* =================================
   FLASH A BUTTON
   ================================= */

function flashButton(color) {

    var button = document.getElementById(color);

    button.classList.add("active");

    setTimeout(function () {

        button.classList.remove("active");

    }, 250);
}


/* =================================
   PLAYER CLICKS BUTTON
   ================================= */

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (!isPlaying || isShowingSequence) {
            return;
        }

        var selectedColor = button.dataset.color;

        flashButton(selectedColor);

        playerSequence.push(selectedColor);

        checkPlayerMove();

    });

});


/* =================================
   CHECK PLAYER MOVE
   ================================= */

function checkPlayerMove() {

    var currentIndex = playerSequence.length - 1;

    var correctColor = sequence[currentIndex];

    var playerColor = playerSequence[currentIndex];


    /* -----------------------------
       WRONG BUTTON
       ----------------------------- */

    if (playerColor !== correctColor) {

        endGame();

        return;
    }


    /* -----------------------------
       CORRECT BUTTON
       ----------------------------- */

    score++;

    scoreDisplay.textContent = score;


    /* -----------------------------
       COMPLETE SEQUENCE
       ----------------------------- */

    if (playerSequence.length === sequence.length) {

        disableButtons();

        statusDisplay.textContent =
            "Correct! Get ready for the next level.";

        setTimeout(function () {

            nextRound();

        }, 900);
    }

}


/* =================================
   END GAME
   ================================= */

async function endGame() {

    if (window.__skillsTrackGameSaved) {
        return;
    }

    window.__skillsTrackGameSaved = true;

    isPlaying = false;

    isShowingSequence = false;

    disableButtons();

    finalScoreDisplay.textContent = score;

    statusDisplay.textContent =
        "You entered the wrong sequence.";

    gameOverDisplay.classList.remove("hidden");

    startButton.classList.add("hidden");

    /* -----------------------------
       SAVE HIGH SCORE
       ----------------------------- */

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "skillsTrackMemoryHighScore",
            highScore
        );

        highScoreDisplay.textContent = highScore;
    }

    await saveGameResult();

    setTimeout(function () {
        window.location.href = "../src/pages/tasks.html";
    }, 1500);

}


/* =================================
   ENABLE GAME BUTTONS
   ================================= */

function enableButtons() {

    buttons.forEach(function (button) {

        button.disabled = false;

    });

}


/* =================================
   DISABLE GAME BUTTONS
   ================================= */

function disableButtons() {

    buttons.forEach(function (button) {

        button.disabled = true;

    });

}

