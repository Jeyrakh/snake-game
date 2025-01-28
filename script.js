const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-game');
const restartButton = document.getElementById('restart-game');
const menu = document.querySelector('.menu');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

let snake;
let direction;
let apple;
let score;

function initGame() {
  canvas.style.display = 'block';
  menu.style.display = 'none';
  gameOverScreen.style.display = 'none';

  snake = [{ x: 300, y: 200 }];
  direction = { x: 20, y: 0 };
  apple = placeApple();
  score = 0;

  window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (isGameOver()) {
    endGame();
    return;
  }

  setTimeout(() => {
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
  }, 100);
}

function update() {
  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };

  // Проверяем на поедание яблока
  if (newHead.x === apple.x && newHead.y === apple.y) {
    score += 1;
    apple = placeApple(); // Генерируем новое яблоко
  } else {
    snake.pop(); // Убираем хвост, если яблоко не съедено
  }

  snake.unshift(newHead);
}

function draw() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Рисуем яблоко
  ctx.fillStyle = '#ff6f61';
  ctx.fillRect(apple.x, apple.y, 20, 20);

  // Рисуем змейку
  ctx.fillStyle = '#4CAF50';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, 20, 20);
  });

  // Рисуем счёт
  ctx.fillStyle = '#000000';
  ctx.font = '20px Arial';
  ctx.fillText(`Счёт: ${score}`, 10, 20);
}

function isGameOver() {
  const head = snake[0];

  // Проверяем столкновение с краями
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    return true;
  }

  // Проверяем столкновение с хвостом
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function endGame() {
  canvas.style.display = 'none';
  gameOverScreen.style.display = 'block';
  finalScore.textContent = score;
}

function placeApple() {
  const x = Math.floor((Math.random() * canvas.width) / 20) * 20;
  const y = Math.floor((Math.random() * canvas.height) / 20) * 20;
  return { x, y };
}

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -20 };
  else if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 20 };
  else if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -20, y: 0 };
  else if (key === 'ArrowRight' && direction.x === 0) direction = { x: 20, y: 0 };
});

startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);
