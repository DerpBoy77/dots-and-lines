export function getBotMove() {
  const validLines = document.querySelectorAll(".valid");
  let validLineIDs = [];
  validLines.forEach((line) => {
    validLineIDs.push(line.dataset.id);
  });

  return validLineIDs[getRandom(validLineIDs.length - 1)];
}

function getRandom(max) {
  return Math.floor(Math.random() * (max + 1));
}
