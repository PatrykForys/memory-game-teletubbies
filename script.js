const board = document.getElementById("board");
const boardText = document.getElementById("board-text");
const timer = document.getElementById("divTimer");
const startGameBtn = document.getElementById("startGame");
const returnToHomePageBtn = document.getElementById("returnToHomePage");
const showLeaderboardBtn = document.getElementById("showLeaderboard");
const homeButtons = document.getElementById("home-buttons");
const gameButtons = document.getElementById("game-buttons");
const moveCounterElement = document.getElementById("moveCounter");
const winningModal = document.getElementById("winningModal");
const leaderboardModal = document.getElementById("leaderboardModal");
const nameModal = document.getElementById("nameModal");
const finalTimeElement = document.getElementById("finalTime");
const finalMovesElement = document.getElementById("finalMoves");
const leaderboardTableBody = document.querySelector("#leaderboardTable tbody");
const title = document.getElementById("title");
const purpleTeletubbies = document.getElementById("purple-teletubbies");
const yellowTeletubbies = document.getElementById("yellow-teletubbies");
let timerInterval;
let moves = 0;
const cards = [
  "img/czerwony.png",
  "img/fioletowy.png",
  "img/zolta.png",
  "img/rynna.png",
  "img/vacuum.png",
  "img/zielony.png",
  "img/slonce.png",
  "img/logo.png",
];

returnToHomePageBtn.style.display = "none";
gameButtons.style.display = "none";
title.style.animation = "glow 4s ease infinite alternate";

let lockBoard = false;
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;

const cardPairs = [...cards, ...cards];

function shuffleCards(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function startGame() {
  matchedPairs = 0;
  moves = 0;
  updateMoveCounter();
  const shuffledCards = shuffleCards([...cardPairs]);
  board.innerHTML = "";
  showGameElements();

  shuffledCards.forEach((background, index) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.dataset.background = background;
    div.dataset.index = index;
    div.textContent = "?";
    div.addEventListener("click", flipCards);
    div.style.animation = `dealCard ${0.1 * index}s ease-out`;
    board.appendChild(div);
  });

  startTimer();
}

function showGameElements() {
  timer.style.display = "block";
  boardText.style.display = "none";
  returnToHomePageBtn.style.display = "block";
  homeButtons.style.display = "none";
  gameButtons.style.display = "flex";
  board.style.display = "grid";
  purpleTeletubbies.style.animation = "";
  yellowTeletubbies.style.animation = "";
  title.style.animation = "";
}

function returnToHomePage() {
  timer.style.display = "none";
  boardText.style.display = "block";
  homeButtons.style.display = "flex";
  gameButtons.style.display = "none";
  board.style.display = "none";
  title.style.animation = "glow 4s ease infinite alternate";
}

function flipCards() {
  if (lockBoard) return;
  const clickedCard = this;

  if (clickedCard === firstCard) return;

  clickedCard.classList.add("flipped");
  clickedCard.style.backgroundImage = `url(${clickedCard.dataset.background})`;
  clickedCard.textContent = "";

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;
  lockBoard = true;

  incrementMoveCounter();
  checkForMatch();
}

function checkForMatch() {
  const isMatch =
    firstCard.dataset.background === secondCard.dataset.background;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    disableCards();
  } else {
    unFlipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCards);
  secondCard.removeEventListener("click", flipCards);

  resetBoard();
  checkIfGameWon();
}

function unFlipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard.style.backgroundImage = "";
    secondCard.style.backgroundImage = "";
    firstCard.textContent = "?";
    secondCard.textContent = "?";
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [lockBoard, firstCard, secondCard] = [false, null, null];
}

function startTimer() {
  const timerElement = document.querySelector(".timer");
  let totalMilliseconds = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    totalMilliseconds += 100;
    const seconds = Math.floor(totalMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const milliseconds = totalMilliseconds % 1000;
    timerElement.textContent = `Czas: ${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${Math.floor(
      milliseconds / 100
    )
      .toString()
      .padStart(1, "0")}`;
  }, 100);
}

function checkIfGameWon() {
  if (matchedPairs === cards.length) {
    clearInterval(timerInterval);
    setTimeout(() => {
      const finalTime = document.querySelector(".timer").textContent;
      const finalMoves = moveCounterElement.textContent;
      showWinningModal(finalTime, finalMoves);
      triggerConfetti();
    }, 500);
  }
}

function showWinningModal(time, moves) {
  finalTimeElement.textContent = `Twój czas: ${time.replace("Czas: ", "")}`;
  finalMovesElement.textContent = `Ruchy: ${moves.replace("Ruchy: ", "")}`;
  winningModal.style.display = "block";
}

function triggerConfetti() {
  confetti({
    particleCount: 300,
    spread: 100,
    origin: { y: 0.6 },
    shapes: ["star", "circle", "square"],
    colors: ["#FF4DA6"],
    scalar: 1.2,
  });
}

function resetGame() {
  lockBoard = false;
  firstCard = null;
  secondCard = null;
  clearInterval(timerInterval);
  closeAllModals();
  startGame();
}

function incrementMoveCounter() {
  moves++;
  updateMoveCounter();
}

function updateMoveCounter() {
  moveCounterElement.textContent = `Ruchy: ${moves}`;
}

function openWinningModal() {
  winningModal.style.display = "block";
}

function closeModal() {
  winningModal.style.display = "none";
  leaderboardModal.style.display = "none";
  nameModal.style.display = "none";
}

function openNameModal() {
  nameModal.style.display = "block";
}

function toggleLeaderboard() {
  if (leaderboardTableBody.innerHTML === "") {
    loadLeaderboard();
  }
  leaderboardModal.style.display = "block";
}

function saveScore() {
  const playerNameInput = document.getElementById("playerName");
  const playerName = playerNameInput.value.trim() || "Anonim";
  const finalTime = finalTimeElement.textContent.replace("Twój czas: ", "");
  const finalMoves = finalMovesElement.textContent.replace("Ruchy: ", "");

  const score = {
    name: playerName,
    time: parseTime(finalTime),
    moves: parseInt(finalMoves),
  };

  saveToLocalStorage(score);
  loadLeaderboard();
  nameModal.style.display = "none";
  winningModal.style.display = "none";
}

function parseTime(timeStr) {
  const [minutes, rest] = timeStr.split(":");
  const [seconds, tenths] = rest.split(".");
  return parseInt(minutes) * 60 + parseInt(seconds) + parseFloat(tenths) / 10;
}

function saveToLocalStorage(newScore) {
  let scores = JSON.parse(localStorage.getItem("memoryScores")) || [];
  scores.push(newScore);
  scores.sort((a, b) => {
    if (a.time === b.time) {
      return a.moves - b.moves;
    }
    return a.time - b.time;
  });
  if (scores.length > 5) {
    scores = scores.slice(0, 5);
  }
  localStorage.setItem("memoryScores", JSON.stringify(scores));
}

function loadLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("memoryScores")) || [];
  leaderboardTableBody.innerHTML = "";
  scores.forEach((score, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${score.name}</td>
      <td>${formatTime(score.time)}</td>
      <td>${score.moves}</td>
    `;
    leaderboardTableBody.appendChild(tr);
  });
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  const tenths = Math.floor((totalSeconds % 1) * 10).toString();
  return `${minutes}:${seconds}.${tenths}`;
}

function closeAllModals() {
  winningModal.style.display = "none";
  leaderboardModal.style.display = "none";
  nameModal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == winningModal) {
    winningModal.style.display = "none";
  }
  if (event.target == leaderboardModal) {
    leaderboardModal.style.display = "none";
  }
  if (event.target == nameModal) {
    nameModal.style.display = "none";
  }
};
