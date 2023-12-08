// name of id, class
const consts = {
  id: {
    GAME_BOARD: "game-board",
    INSTRUCTION_TEXT: "instruction-text",
    LOGO: "logo",
    SCORE: "score",
    HIGH_SCORE: "highScore",
    NEW_SCORE_NOTICE: "new-score",
  },
  setting: {
    DIRECTION: 0,
    GAME_SPEED: 100,
  },
};

let gameSpeed = consts.setting.GAME_SPEED;
let gameStarted = false;
let direction = consts.setting.DIRECTION;
const boardSize = 20;
let snake = [];

let food = {};
let gameInterval = null;

const board = document.getElementById(consts.id.GAME_BOARD);
const instructionText = document.getElementById(consts.id.INSTRUCTION_TEXT);
const log = document.getElementById(consts.id.LOGO);
const score = document.getElementById(consts.id.SCORE);
const highScore = document.getElementById(consts.id.HIGH_SCORE);
const newScoreNotice = document.getElementById(consts.id.NEW_SCORE_NOTICE);

// Draw game map, snake, food
function draw() {
  // clear drawing board for like actual animation effect
  board.textContent = "";

  drawSnake();
  drawFood();
}

// Draw Snake
function drawSnake() {
  snake.forEach((position) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, position);
    board.appendChild(snakeElement);
  });
}

// create HTML Element to draw
function createGameElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}

// set the position of snake or food.
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawFood() {
  if (!gameStarted) {
    return;
  }

  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function generateFood() {
  // Generate a random number between 1 and 20 (inclusive)
  const x = Math.floor(Math.random() * boardSize) + 1;
  const y = Math.floor(Math.random() * boardSize) + 1;
  return { x, y };
}

function move() {
  let newHead = { ...snake[0] };

  switch (direction) {
    case 0:
      newHead.y--;
      break;
    case 1:
      newHead.x++;
      break;
    case 2:
      newHead.y++;
      break;
    case 3:
      newHead.x--;
      break;
  }
  snake.unshift(newHead);

  if (newHead.x == food.x && newHead.y == food.y) {
    food = generateFood();
    increaseSpeed();
    updateScore();
    clearInterval(gameInterval);

    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeed);
  } else {
    snake.pop();
  }
}

function startGame() {
  snake.push(generateFood());
  gameStarted = true;
  instructionText.style.display = "none";
  newScoreNotice.style.display = "none";
  log.style.display = "none";
  food = generateFood();

  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeed);
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > boardSize || head.y < 1 || head.y > boardSize) {
    resetGame();
  }

  // check if Snake head collides with its body
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// Event Listener
function handleKeyPress(e) {
  if ((!gameStarted && e.code === "Space") || (!gameStarted && e.key === "")) {
    startGame();
  } else {
    switch (e.key) {
      case "ArrowUp":
        newDirection = 0;
        break;
      case "ArrowRight":
        newDirection = 1;
        break;
      case "ArrowDown":
        newDirection = 2;
        break;
      case "ArrowLeft":
        newDirection = 3;
        break;
    }
    // When snake is longer than 1, you can NOT turn into count-direction.
    if (
      snake.length >= 2 &&
      (direction == newDirection + 2 || direction == newDirection - 2)
    ) {
      return;
    } else {
      direction = newDirection;
    }
  }
}

function increaseSpeed() {
  let speed = gameSpeed;

  if (speed >= 150) {
    speed -= 5;
  } else if (speed >= 100) {
    speed -= 3;
  } else if (speed > 50) {
    speed -= 2;
  } else {
    return;
  }
}

function resetGame() {
  updateHighScore();
  snake = [];
  updateScore();
  food = {};
  direction = consts.setting.DIRECTION;
  gameSpeed = consts.setting.GAME_SPEED;
  stopGame();
}

function updateHighScore() {
  highScore.textContent;
  const currentScore = snake.length - 1;
  if (currentScore > parseInt(highScore.textContent)) {
    highScore.textContent = currentScore.toString().padStart(3, "0");
    highScore.style.display = "block";
    newScoreNotice.style.display = "block";
  }
}

function updateScore() {
  let currentScore;
  if (snake.length <= 0) {
    currentScore = 0;
  } else {
    currentScore = snake.length - 1;
  }

  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  gameStarted = false;
  clearInterval(gameInterval);
  instructionText.style.display = "block";
  log.style.display = "block";
}

// Add Event Listener
document.addEventListener("keydown", handleKeyPress);

// Testing...
