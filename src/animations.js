// Animation constants
export const ANIMATION_CONSTANTS = {
  DOT_ANIMATION_DELAY: 25,
  LINE_ANIMATION_DELAY: 15,
};

export function animateGridElements(dots, lines, config) {
  animateDotsWithDiagonalPattern(dots, config.gridSize);
  animateLinesWithDelay(lines, config.gridSize);
}

function animateDotsWithDiagonalPattern(dots, gridSize) {
  const maxDelay = gridSize * ANIMATION_CONSTANTS.DOT_ANIMATION_DELAY * 2;

  dots.forEach(({ element, row, col }) => {
    const delay = calculateDiagonalDelay(row, col, gridSize);
    const clampedDelay = Math.min(delay, maxDelay);

    setTimeout(() => {
      element.classList.add("animate");
    }, clampedDelay);
  });
}

function calculateDiagonalDelay(row, col, gridSize) {
  // Animate in diagonal waves
  const diagonalIndex = row + col;
  const secondaryDiagonal = Math.abs(row - col);
  return (
    (diagonalIndex + secondaryDiagonal * 0.5) *
    ANIMATION_CONSTANTS.DOT_ANIMATION_DELAY
  );
}

function animateLinesWithDelay(lines, gridSize) {
  const baseDelay = gridSize * ANIMATION_CONSTANTS.DOT_ANIMATION_DELAY;

  lines.forEach(({ element, type, row, col }) => {
    // Lines appear after dots with additional delay
    const dotDelay = calculateDiagonalDelay(row, col, gridSize);
    const delay =
      baseDelay + dotDelay + ANIMATION_CONSTANTS.LINE_ANIMATION_DELAY;

    setTimeout(() => {
      element.classList.add("animate");
    }, delay);
  });
}

export function clearAnimations(lines) {
  // Clear animation classes from lines
  lines.forEach((line) => {
    line.classList.remove("selected-P1", "selected-P2", "valid", "animate");
  });

  // Clear animation classes from existing dots
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => {
    dot.classList.remove("animate");
  });
}
