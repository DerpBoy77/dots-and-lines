import { getBotMove } from "./bot.js";
import { animateGridElements, clearAnimations } from "./animations.js";

// Constants
const CONSTANTS = {
  GRID_POSITION_MULTIPLIER: 50,
  GRID_MIN_SIZE: 3,
  GRID_MAX_SIZE: 16,
  DEFAULT_GRID_SIZE: 10,
  ANIMATION_DELAY: 150,
  WIN_CHECK_DELAY: 500,
  BOT_MOVE_DELAY: 100,
  POSITION_OFFSET: 12,
  LINE_POSITION_OFFSET: 2,
  DOT_POSITION_OFFSET: 1,

  PLAYERS: {
    HUMAN: 0,
    BOT: 1,
  },
  STYLES: {
    CONNECTED: 0,
    FREEFORM: 1,
  },
};

const CONFIG = {
  gridSize: CONSTANTS.DEFAULT_GRID_SIZE,
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
  mode: 0,
  style: 0,
};

function calculatePosition(index) {
  return index * CONSTANTS.GRID_POSITION_MULTIPLIER;
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
  line.className = "line horizontal";
  line.dataset.type = "horizontal";
  line.dataset.row = row;
  line.dataset.col = col;
  line.dataset.id = `line-h-${row}-${col}`;

  const leftPos = calculatePosition(col);
  const topPos =
    calculatePosition(row) + (CONFIG.dotSize - CONFIG.lineHeight) / 2;

  line.style.left = `${leftPos + CONSTANTS.LINE_POSITION_OFFSET}px`;
  line.style.top = `${topPos}px`;
  line.style.width = `${CONFIG.lineWidth}px`;
  line.style.height = `${CONFIG.lineHeight}px`;

  line.addEventListener("click", () => handleLineClick(line));
  return line;
}

function createVerticalLine(row, col) {
  const line = document.createElement("div");
  line.className = "line vertical";
  line.dataset.type = "vertical";
  line.dataset.row = row;
  line.dataset.col = col;
  line.dataset.id = `line-v-${row}-${col}`;

  const leftPos =
    calculatePosition(col) + (CONFIG.dotSize - CONFIG.lineHeight) / 2;
  const topPos = calculatePosition(row) + CONFIG.dotSize / 3;

  line.style.left = `${leftPos}px`;
  line.style.top = `${topPos + CONSTANTS.DOT_POSITION_OFFSET}px`;
  line.style.width = `${CONFIG.lineHeight}px`;
  line.style.height = `${CONFIG.lineWidth}px`;

  line.addEventListener("click", () => handleLineClick(line));

  return line;
}

function handleLineClick(lineElement) {
  if (!lineElement || !lineElement.dataset) {
    console.error("Invalid line element provided to handleLineClick");
    return;
  }

  const lineId = lineElement.dataset.id;
  if (!lineId) {
    console.error("Line element missing required data-id attribute");
    return;
  }

  const currentPlayer = getCurrentPlayer();
  if (!currentPlayer) {
    console.error("Unable to get current player");
    return;
  }

  if (gameState.selectedLines.has(lineId)) {
    return;
  }
  if (!lineElement.classList.contains("valid")) {
    return;
  }

  gameState.selectedLines.add(lineId);
  if (currentPlayer.index === CONSTANTS.PLAYERS.HUMAN) {
    lineElement.classList.add("selected-P1");
  } else {
    lineElement.classList.add("selected-P2");
  }

  gameState.playerLines[currentPlayer.index].add(lineId);
  const completedSquares = getCompletedSquares(lineElement);
  if (completedSquares.length === 0) {
    updateCurrentDot(lineElement);
    switchPlayer();
  } else if (completedSquares.length > 0) {
    gameState.currentDot = null;
    // Player gets another turn for completing squares - no player switch
    // Trigger bot move after a delay to prevent stack overflow
    if (
      gameState.mode === CONSTANTS.PLAYERS.BOT &&
      gameState.currentPlayer === CONSTANTS.PLAYERS.BOT
    ) {
      setTimeout(() => clickBotMove(), CONSTANTS.ANIMATION_DELAY);
    }
  }
  getActive();
}

function updateCurrentDot(lineElement) {
  const lineType = lineElement.dataset.type;
  const row = parseInt(lineElement.dataset.row);
  const col = parseInt(lineElement.dataset.col);
  let endpoints;
  if (lineType === "horizontal") {
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

  if (gameState.currentDot === null) {
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
  if (!DOM.grid) {
    console.error("Grid element not found!");
    return;
  }

  const grid = DOM.grid;

  grid.innerHTML = "";
  const gridPixelSize =
    CONSTANTS.GRID_POSITION_MULTIPLIER * (CONFIG.gridSize - 1) + CONFIG.dotSize;
  grid.style.width = grid.style.height = `${gridPixelSize}px`;
  // Create all elements first without animation
  const dots = [];
  const lines = [];

  for (let row = 0; row < CONFIG.gridSize; row++) {
    for (let col = 0; col < CONFIG.gridSize; col++) {
      const dot = createDot(row, col);
      grid.appendChild(dot);
      dots.push({ element: dot, row, col });

      if (col < CONFIG.gridSize - 1) {
        const hLine = createHorizontalLine(row, col);
        grid.appendChild(hLine);
        gameState.lines.push(hLine);
        lines.push({ element: hLine, type: "horizontal", row, col });
      }

      if (row < CONFIG.gridSize - 1) {
        const vLine = createVerticalLine(row, col);
        grid.appendChild(vLine);
        gameState.lines.push(vLine);
        lines.push({ element: vLine, type: "vertical", row, col });
      }
    }
  }

  // Animate dots with staggered timing
  animateGridElements(dots, lines, CONFIG);

  // Initialize game state after animation starts
  setTimeout(() => {
    getActive();
    updateUI();
    updateScore();
  }, 200);
}

function resetGame() {
  gameState.selectedLines.clear();
  gameState.playerLines = [new Set(), new Set()];
  clearAnimations(gameState.lines);
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

// DOM element cache
const DOM = {
  grid: null,
  gameBoard: null,
  connectedButton: null,
  freeformButton: null,
  optionsOverlay: null,
  winnerOverlay: null,
  slider: null,
  sliderLabel: null,
  player1Score: null,
  player2Score: null,
  playAgainBtn: null,
  newGameBtn: null,
  vsPlayerBtn: null,
  vsBotBtn: null,
  startGameBtn: null,
  optionsBtn: null,
  resetBtn: null,

  init() {
    this.grid = document.getElementById("grid");
    this.gameBoard = document.querySelector(".game-board");
    this.connectedButton = document.getElementById("connected-btn");
    this.freeformButton = document.getElementById("freeform-btn");
    this.optionsOverlay = document.querySelector(".options-overlay");
    this.winnerOverlay = document.querySelector(".winner-overlay");
    this.slider = document.getElementById("grid-size-slider");
    this.sliderLabel = document.querySelector(".slider-label");
    this.player1Score = document.getElementById("P1-score");
    this.player2Score = document.getElementById("P2-score");
    this.playAgainBtn = document.getElementById("play-again-btn");
    this.newGameBtn = document.getElementById("new-game-btn");
    this.vsPlayerBtn = document.getElementById("vs-player-btn");
    this.vsBotBtn = document.getElementById("vs-bot-btn");
    this.startGameBtn = document.getElementById("start-game-btn");
    this.optionsBtn = document.getElementById("options-btn");
    this.resetBtn = document.getElementById("reset-btn");
  },
};

function setupEventListeners() {
  // Overlay click handlers
  DOM.optionsOverlay?.addEventListener("click", (e) => {
    if (e.target === DOM.optionsOverlay) {
      hideOptionsMenu();
    }
  });
  DOM.winnerOverlay?.addEventListener("click", (e) => {
    if (e.target === DOM.winnerOverlay) {
      hideWinnerOverlay();
    }
  });

  // Game style buttons
  DOM.connectedButton?.addEventListener("click", () => connectedMode());
  DOM.freeformButton?.addEventListener("click", () => freeformMode());

  // Game mode buttons
  DOM.vsPlayerBtn?.addEventListener("click", () => vsPlayerMode());
  DOM.vsBotBtn?.addEventListener("click", () => vsBotMode());

  // Action buttons
  DOM.playAgainBtn?.addEventListener("click", () => playAgain());
  DOM.newGameBtn?.addEventListener("click", () => newGame());
  DOM.startGameBtn?.addEventListener("click", () => startGame());
  DOM.optionsBtn?.addEventListener("click", () => showOptionsMenu());
  DOM.resetBtn?.addEventListener("click", () => resetGame());

  // Slider input
  DOM.slider?.addEventListener("input", () => sliderInput());
}

document.addEventListener("DOMContentLoaded", () => {
  DOM.init();
  setupEventListeners();
  initializeSlider();

  // Add a small delay for initial load animation
  setTimeout(() => {
    initializeGame();
  }, 100);
});

function switchPlayer() {
  gameState.currentPlayer =
    (gameState.currentPlayer + 1) % CONFIG.players.length;
  updateUI();
  if (
    gameState.mode === CONSTANTS.PLAYERS.BOT &&
    gameState.currentPlayer === CONSTANTS.PLAYERS.BOT
  ) {
    clickBotMove();
  }
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
  if (currentPlayer.index === CONSTANTS.PLAYERS.HUMAN) {
    Player2UI.classList.remove("Current");
    Player1UI.classList.add("Current");
  } else {
    Player1UI.classList.remove("Current");
    Player2UI.classList.add("Current");
  }
}

function updateScore() {
  if (DOM.player1Score && DOM.player2Score) {
    DOM.player1Score.textContent = gameState.score[0];
    DOM.player2Score.textContent = gameState.score[1];
  }
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
  } else if (lineType === "vertical") {
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
  const squareKey = `${row},${col}`;

  // Check if square is already marked by any player
  const alreadyMarked =
    gameState.completedSquares[0].has(squareKey) ||
    gameState.completedSquares[1].has(squareKey);

  if (alreadyMarked) {
    console.warn(`Square at ${row},${col} already marked!`);
    return;
  }

  const square = document.createElement("div");
  square.dataset.row = String(row);
  square.dataset.col = String(col);
  square.dataset.player = String(player.index);
  square.classList.add("square");
  square.style.backgroundColor = player.color;
  square.style.left = `${calculatePosition(col) + CONSTANTS.POSITION_OFFSET}px`;
  square.style.top = `${calculatePosition(row) + CONSTANTS.POSITION_OFFSET}px`;
  DOM.grid.appendChild(square);
  gameState.completedSquares[player.index].add(squareKey);
}

function getActive() {
  gameState.lines.forEach((line) => {
    line.classList.remove("valid");
  });
  if (gameState.style === CONSTANTS.STYLES.CONNECTED) {
    if (gameState.currentDot === null) {
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

      if (validLineIDs.size === 0) {
        gameState.currentDot = null;
        // Check if any unselected lines exist before recursing
        const hasUnselectedLines = gameState.lines.some(
          (line) => !gameState.selectedLines.has(line.dataset.id)
        );
        if (hasUnselectedLines) {
          getActive();
          return;
        }
      } else {
        gameState.lines.forEach((line) => {
          if (validLineIDs.has(line.dataset.id)) {
            line.classList.add("valid");
          }
        });
      }
    }
  } else {
    gameState.lines.forEach((line) => {
      if (!gameState.selectedLines.has(line.dataset.id)) {
        line.classList.add("valid");
      }
    });
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
  if (DOM.optionsOverlay) {
    DOM.optionsOverlay.classList.remove("hidden");
    DOM.optionsOverlay.classList.add("show");
  }
}

function hideOptionsMenu() {
  if (DOM.optionsOverlay) {
    DOM.optionsOverlay.classList.add("hidden");
    DOM.optionsOverlay.classList.remove("show");
  }
}

function initializeSlider() {
  if (!DOM.slider || !DOM.sliderLabel) {
    console.error("Slider elements not found!");
    return;
  }

  const slider = DOM.slider;
  const sliderLabel = DOM.sliderLabel;

  // Calculate max grid size based on screen width, ensure it's an integer
  const maxGridSize = Math.min(
    CONSTANTS.GRID_MAX_SIZE,
    Math.floor(window.innerWidth / CONSTANTS.GRID_POSITION_MULTIPLIER)
  );
  slider.max = String(Math.max(CONSTANTS.GRID_MIN_SIZE, maxGridSize));

  // Set default value, ensure it's an integer
  const maxValue = parseInt(slider.max);
  slider.value = String(
    maxValue < CONSTANTS.DEFAULT_GRID_SIZE
      ? Math.max(CONSTANTS.GRID_MIN_SIZE, Math.floor(maxValue / 2))
      : CONSTANTS.DEFAULT_GRID_SIZE
  );

  CONFIG.gridSize = parseInt(slider.value);
  sliderLabel.textContent = `Grid Size:${slider.value}X${slider.value}`;
}

function sliderInput() {
  if (!DOM.slider || !DOM.sliderLabel) return;

  const slider = DOM.slider;
  const sliderLabel = DOM.sliderLabel;
  const value = parseInt(slider.value);
  sliderLabel.textContent = `Grid Size:${value}X${value}`;
  CONFIG.gridSize = value;
}

function startGame() {
  hideOptionsMenu();
  resetGame();
}

function winCheck() {
  const totalSquares = (CONFIG.gridSize - 1) ** 2;
  const totalCompletedSquares = gameState.score[0] + gameState.score[1];
  const winningScore = Math.floor(totalSquares / 2) + 1;

  // Check if a player has more than half the squares (early win condition)
  // or if all squares are completed (handle ties)
  if (
    gameState.score[0] >= winningScore ||
    gameState.score[1] >= winningScore ||
    totalCompletedSquares === totalSquares
  ) {
    setTimeout(() => {
      showWinner();
    }, CONSTANTS.WIN_CHECK_DELAY);
  }
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
    if (gameState.mode === CONSTANTS.PLAYERS.BOT) {
      winnerPlayer.textContent = "Bot Wins!";
    } else {
      winnerPlayer.textContent = "Player 2 Wins!";
    }
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

function vsPlayerMode() {
  const playerButton = document.querySelector(".Mode1");
  const botButton = document.querySelector(".Mode2");
  const p2Name = document.querySelector(".p2-win-name");
  const p2Text = document.getElementById("p2");
  p2Name.textContent = "Player 2";
  playerButton.classList.add("active");
  botButton.classList.remove("active");
  p2Text.textContent = "Player 2";
  gameState.mode = CONSTANTS.PLAYERS.HUMAN;
}

function vsBotMode() {
  const playerButton = document.querySelector(".Mode1");
  const p2Name = document.querySelector(".p2-win-name");
  const botButton = document.querySelector(".Mode2");
  const p2Text = document.getElementById("p2");
  playerButton.classList.remove("active");
  botButton.classList.add("active");
  p2Text.textContent = "Bot";
  p2Name.textContent = "Bot";
  gameState.mode = CONSTANTS.PLAYERS.BOT;
}

function clickBotMove() {
  getActive();
  const move = getBotMove();
  console.log(move);
  if (move) {
    setTimeout(() => {
      const element = document.querySelector(`[data-id="${move}"]`);
      if (element) {
        element.click();
      }
    }, CONSTANTS.BOT_MOVE_DELAY);
  }
}

function connectedMode() {
  if (!DOM.connectedButton || !DOM.freeformButton) return;

  const connectedButton = DOM.connectedButton;
  const freeformButton = DOM.freeformButton;
  connectedButton.classList.add("active");
  freeformButton.classList.remove("active");
  gameState.style = CONSTANTS.STYLES.CONNECTED;
}

function freeformMode() {
  if (!DOM.connectedButton || !DOM.freeformButton) return;

  const connectedButton = DOM.connectedButton;
  const freeformButton = DOM.freeformButton;
  freeformButton.classList.add("active");
  connectedButton.classList.remove("active");
  gameState.style = CONSTANTS.STYLES.FREEFORM;
}
