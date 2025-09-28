export function getBotMove() {
  const validLines = document.querySelectorAll(".valid");

  // Handle empty case early
  if (validLines.length === 0) {
    console.warn("No valid lines available for bot move");
    return null;
  }

  // Use Array.from for better readability and performance
  const validLineIDs = Array.from(
    validLines,
    (line) => line.dataset?.id
  ).filter(Boolean);

  if (validLineIDs.length === 0) {
    console.warn("No valid line IDs found");
    return null;
  }

  const randomIndex = getRandomInt(0, validLineIDs.length - 1);
  return validLineIDs[randomIndex];
}

function getRandomInt(min, max) {
  if (min > max) {
    throw new Error("Min value cannot be greater than max value");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
