// Выбор HTML элементов
const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Настройки игрового поля
canvas.width = 600;
canvas.height = 400;

const gridSize = 20;
let snake = [{ x: gridSize * 2, y: gridSize * 2 }];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let gameInterval;

// Обработчик нажатия кнопки "Начать игру"
startButton.addEventListener('click', () => {
  menu.style.display = 'none';
  gameContainer.style.display = 'block';
  scoreElement.innerText = `Счёт: 0`;
  resetGame();
  startGame();
});

// Логика сброса игры
function resetGame() {
  snake = [{ x: gridSize * 2, y: gridSize * 2 }];
  direction = 'RIGHT';
  food = generateFood();
  score = 0;
}

// Логика запуска игры
function startGame() {
  gameInterval = setInterval(update, 100);
}

// Логика обновления игрового поля
function update() {
  const head = { ...snake[0] };

  // Управление направлением змейки
  if (direction === 'UP') head.y -= gridSize;
  if (direction === 'DOWN') head.y += gridSize;
  if (direction === 'LEFT') head.x -= gridSize;
  if (direction === 'RIGHT') head.x += gridSize;

  // Проверка столкновений
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert(`Игра окончена! Ваш счёт: ${score}`);
    menu.style.display = 'block';
    gameContainer.style.display = 'none';
    return;
  }

  // Добавление головы змеи
  snake.unshift(head);

  // Проверка поедания еды
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.innerText = `Счёт: ${score}`;
    food = generateFood();
  } else {
    // Удаление хвоста змеи
    snake.pop();
  }

  draw();
}

// Генерация позиции еды
function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}

// Логика отрисовки игры
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовка змейки
  ctx.fillStyle = '#006400';

  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  // Отрисовка еды
  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Управление с клавиатуры
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});
