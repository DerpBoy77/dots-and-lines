const CONFIG = {
  gridSize: 10,
  dotSize: 16,
  lineWidth: 54,
  lineHeight: 8,
  players: ["Player 1", "Player 2"],
  playerColors: ["#ff4444", "#4444ff"],
};

const gameState = {
  lines: [],
  completedSquares: [new Set(), new Set()],
  selectedLines: new Set(),
  currentPlayer: 0,
  score: [0, 0],
  playerLines: [new Set(), new Set()],
  currentDot: null,
};

function calculatePosition(index) {
  return index * 50;
}

function createDot(row, col) {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.dataset.row = row;
  dot.dataset.col = col;
  dot.dataset.id = `dot-${row}-${col}`;

  dot.style.top = `${calculatePosition(row)}px`;
  dot.style.left = `${calculatePosition(col)}px`;
  return dot;
}

function createHorizontalLine(row, col) {
  const line = document.createElement("div");
  line.className = "line";
  line.dataset.type = "horizontal";
  line.dataset.row = row;
  line.dataset.col = col;
  line.dataset.id = `line-h-${row}-${col}`;

  const leftPos = calculatePosition(col);
  const topPos =
    calculatePosition(row) + (CONFIG.dotSize - CONFIG.lineHeight) / 2;

  line.style.left = `${leftPos + 2}px`;
  line.style.top = `${topPos}px`;
  line.style.width = `${CONFIG.lineWidth}px`;
  line.style.height = `${CONFIG.lineHeight}px`;

  line.addEventListener("click", () => handleLineClick(line));
  return line;
}

function createVerticalLine(row, col) {
  const line = document.createElement("div");
  line.className = "line";
  line.dataset.type = "vertical";
  line.dataset.row = row;
  line.dataset.col = col;
  line.dataset.id = `line-v-${row}-${col}`;

  const leftPos =
    calculatePosition(col) + (CONFIG.dotSize - CONFIG.lineHeight) / 2;
  const topPos = calculatePosition(row) + CONFIG.dotSize / 3;

  line.style.left = `${leftPos}px`;
  line.style.top = `${topPos + 1}px`;
  line.style.width = `${CONFIG.lineHeight}px`;
  line.style.height = `${CONFIG.lineWidth}px`;

  line.addEventListener("click", () => handleLineClick(line));

  return line;
}

function handleLineClick(lineElement) {
  const lineId = lineElement.dataset.id;
  const currentPlayer = getCurrentPlayer();

  if (gameState.selectedLines.has(lineId)) {
    return;
  }
  if (!lineElement.classList.contains("valid")) {
    return;
  }

  gameState.selectedLines.add(lineId);
  if (currentPlayer.index == 0) {
    lineElement.classList.add("selected-P1");
  } else {
    lineElement.classList.add("selected-P2");
  }

  gameState.playerLines[currentPlayer.index].add(lineId);
  const completedSquares = getCompletedSquares(lineElement);
  if (completedSquares.length === 0) {
    switchPlayer();
    updateCurrentDot(lineElement);
  } else if (completedSquares.length > 0) {
    gameState.currentDot = null;
  }
  getActive();
}

function updateCurrentDot(lineElement) {
  const lineType = lineElement.dataset.type;
  const row = parseInt(lineElement.dataset.row);
  const col = parseInt(lineElement.dataset.col);
  let endpoints;
  if (lineType == "horizontal") {
    endpoints = [
      [row, col],
      [row, col + 1],
    ];
  } else {
    endpoints = [
      [row, col],
      [row + 1, col],
    ];
  }

  if (gameState.currentDot == null) {
    gameState.currentDot = endpoints;
  } else {
    const newDots = [];
    endpoints.forEach((dot) => {
      const isInCurrentDot = gameState.currentDot.some(
        (currentDot) => currentDot[0] === dot[0] && currentDot[1] === dot[1]
      );
      if (!isInCurrentDot) {
        newDots.push(dot);
      }
    });
    gameState.currentDot = newDots;
  }
}

function initializeGame() {
  const grid = document.getElementById("grid");

  if (!grid) {
    console.error("Grid element not found!");
    return;
  }

  grid.innerHTML = "";
  grid.style.width = grid.style.height = `${50 * (CONFIG.gridSize - 1) + 16}px`;

  for (let row = 0; row < CONFIG.gridSize; row++) {
    for (let col = 0; col < CONFIG.gridSize; col++) {
      const dot = createDot(row, col);
      grid.appendChild(dot);

      if (col < CONFIG.gridSize - 1) {
        const hLine = createHorizontalLine(row, col);
        grid.appendChild(hLine);
        gameState.lines.push(hLine);
      }

      if (row < CONFIG.gridSize - 1) {
        const vLine = createVerticalLine(row, col);
        grid.appendChild(vLine);
        gameState.lines.push(vLine);
      }
    }
  }
  getActive();
  updateUI();
  updateScore();
}

function resetGame() {
  gameState.selectedLines.clear();
  gameState.playerLines = [new Set(), new Set()];
  gameState.lines.forEach((line) => {
    line.classList.remove("selected-P1", "selected-P2", "valid");
  });
  gameState.completedSquares = [new Set(), new Set()];
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.remove();
  });
  gameState.score = [0, 0];
  gameState.currentPlayer = 0;
  gameState.currentDot = null;
  gameState.lines = [];

  initializeGame();
  console.log("Game reset");
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSlider();
  initializeGame();
  const optionsOverlay = document.querySelector(".options-overlay");
  const winnerOverlay = document.querySelector(".winner-overlay");
  optionsOverlay.addEventListener("click", (e) => {
    if (e.target === optionsOverlay) {
      hideOptionsMenu();
    }
  });
  winnerOverlay.addEventListener("click", (e) => {
    if (e.target === winnerOverlay) {
      hideWinnerOverlay();
    }
  });
});

function switchPlayer() {
  gameState.currentPlayer =
    (gameState.currentPlayer + 1) % CONFIG.players.length;
  updateUI();
}

function getCurrentPlayer() {
  return {
    index: gameState.currentPlayer,
    name: CONFIG.players[gameState.currentPlayer],
    color: CONFIG.playerColors[gameState.currentPlayer],
  };
}

function updateUI() {
  const currentPlayer = getCurrentPlayer();
  const Player1UI = document.getElementById("player1-container");
  const Player2UI = document.getElementById("player2-container");
  if (currentPlayer.index == 0) {
    Player2UI.classList.remove("Current");
    Player1UI.classList.add("Current");
  } else {
    Player1UI.classList.remove("Current");
    Player2UI.classList.add("Current");
  }
}

function updateScore() {
  const player1score = document.getElementById("P1-score");
  const player2score = document.getElementById("P2-score");
  player1score.innerHTML = `${gameState.score[0]}`;
  player2score.innerHTML = `${gameState.score[1]}`;
}

function getCompletedSquares(lineElement) {
  const lineType = lineElement.dataset.type;
  const row = parseInt(lineElement.dataset.row);
  const col = parseInt(lineElement.dataset.col);
  const currentPlayer = getCurrentPlayer();
  const completedSquares = [];

  if (lineType == "horizontal") {
    if (row > 0) {
      if (isSquareComplete(row - 1, col)) {
        completedSquares.push({ row: row - 1, col: col });
      }
    }
    if (row < CONFIG.gridSize - 1) {
      if (isSquareComplete(row, col)) {
        completedSquares.push({ row: row, col: col });
      }
    }
  } else if (lineType == "vertical") {
    if (col > 0) {
      if (isSquareComplete(row, col - 1)) {
        completedSquares.push({ row: row, col: col - 1 });
      }
    }
    if (col < CONFIG.gridSize - 1) {
      if (isSquareComplete(row, col)) {
        completedSquares.push({ row: row, col: col });
      }
    }
  }

  completedSquares.forEach((square) => {
    markSquare(square.row, square.col, currentPlayer);
    gameState.score[currentPlayer.index]++;
    updateScore();
  });
  winCheck();

  return completedSquares;
}

function isSquareComplete(row, col) {
  const topLineId = `line-h-${row}-${col}`; // Horizontal line at top
  const bottomLineId = `line-h-${row + 1}-${col}`; // Horizontal line at bottom
  const leftLineId = `line-v-${row}-${col}`; // Vertical line at left
  const rightLineId = `line-v-${row}-${col + 1}`; // Vertical line at right

  return (
    gameState.selectedLines.has(topLineId) &&
    gameState.selectedLines.has(bottomLineId) &&
    gameState.selectedLines.has(leftLineId) &&
    gameState.selectedLines.has(rightLineId)
  );
}

function markSquare(row, col, player) {
  const grid = document.getElementById("grid");
  const square = document.createElement("div");
  square.dataset.row = row;
  square.dataset.col = col;
  square.dataset.player = player;
  square.classList.add("square");
  square.style.backgroundColor = player.color;
  square.style.left = `${calculatePosition(col) + 12}px`;
  square.style.top = `${calculatePosition(row) + 12}px`;
  grid.appendChild(square);
  gameState.completedSquares[player.index].add({ row: row, col: col });
}

function getActive() {
  gameState.lines.forEach((line) => {
    line.classList.remove("valid");
  });
  if (gameState.currentDot == null) {
    gameState.lines.forEach((line) => {
      if (!gameState.selectedLines.has(line.dataset.id)) {
        line.classList.add("valid");
      }
    });
  } else {
    const validLineIDs = new Set();
    gameState.currentDot.forEach((dot) => {
      const connectedLines = getConnectedLines(dot[0], dot[1]);
      connectedLines.forEach((lineID) => {
        if (!gameState.selectedLines.has(lineID)) {
          validLineIDs.add(lineID);
        }
      });
    });
    if (validLineIDs.size == 0) {
      gameState.currentDot = null;
      getActive();
      return;
    } else {
      gameState.lines.forEach((line) => {
        if (validLineIDs.has(line.dataset.id)) {
          line.classList.add("valid");
        }
      });
    }
  }
}

function getConnectedLines(row, col) {
  const connectedLines = [];
  // Horizontal line to the left (if exists)
  if (col > 0) {
    connectedLines.push(`line-h-${row}-${col - 1}`);
  }

  // Horizontal line to the right (if exists)
  if (col < CONFIG.gridSize - 1) {
    connectedLines.push(`line-h-${row}-${col}`);
  }

  // Vertical line above (if exists)
  if (row > 0) {
    connectedLines.push(`line-v-${row - 1}-${col}`);
  }

  // Vertical line below (if exists)
  if (row < CONFIG.gridSize - 1) {
    connectedLines.push(`line-v-${row}-${col}`);
  }

  return connectedLines;
}

function showOptionsMenu() {
  const overlay = document.querySelector(".options-overlay");
  overlay.classList.remove("hidden");
  overlay.classList.add("show");
}

function hideOptionsMenu() {
  const overlay = document.querySelector(".options-overlay");
  overlay.classList.add("hidden");
  overlay.classList.remove("show");
}

function initializeSlider() {
  const slider = document.querySelector(".slider");
  const sliderLabel = document.querySelector(".slider-label");
  slider.max = window.innerWidth / 50 > 16 ? 16 : window.innerWidth / 50;
  slider.value = slider.max < 10 ? slider.max / 2 : 10;
  CONFIG.gridSize = slider.value;
  sliderLabel.textContent = `Grid Size:${slider.value}X${slider.value}`;
}

function sliderInput() {
  const slider = document.querySelector(".slider");
  const sliderLabel = document.querySelector(".slider-label");
  const value = slider.value;
  sliderLabel.textContent = `Grid Size:${value}X${value}`;
  CONFIG.gridSize = parseInt(value);
}

function startGame() {
  hideOptionsMenu();
  resetGame();
}

function winCheck() {
  if (
    gameState.score[0] > (CONFIG.gridSize - 1) ** 2 / 2 ||
    gameState.score[1] > (CONFIG.gridSize - 1) ** 2 / 2
  ) {
    setTimeout(() => {
      showWinner();
    }, 500);
  }
  // if (gameState.completedSquares.length === (CONFIG.gridSize - 1) ** 2) {
  //   // Show winner overlay instead of immediately resetting
  //   setTimeout(() => {
  //     showWinner();
  //   }, 500); // Small delay to let players see the final move
  // }
}

function showWinner() {
  const overlay = document.getElementById("winner-overlay");
  const winnerPlayer = document.getElementById("winner-player");
  const finalP1Score = document.getElementById("final-p1-score");
  const finalP2Score = document.getElementById("final-p2-score");

  // Update final scores
  finalP1Score.textContent = gameState.score[0];
  finalP2Score.textContent = gameState.score[1];

  // Determine winner and update display
  if (gameState.score[0] > gameState.score[1]) {
    winnerPlayer.textContent = "Player 1 Wins!";
    winnerPlayer.className = "winner-player player1";
  } else if (gameState.score[1] > gameState.score[0]) {
    winnerPlayer.textContent = "Player 2 Wins!";
    winnerPlayer.className = "winner-player player2";
  } else {
    winnerPlayer.textContent = "It's a Tie!";
    winnerPlayer.className = "winner-player tie";
  }

  // Show the overlay
  overlay.classList.remove("hidden");
  overlay.classList.add("show");
}

function hideWinnerOverlay() {
  const overlay = document.getElementById("winner-overlay");
  overlay.classList.add("hidden");
  overlay.classList.remove("show");
}

function playAgain() {
  hideWinnerOverlay();
  resetGame();
}

function newGame() {
  hideWinnerOverlay();
  showOptionsMenu();
}
