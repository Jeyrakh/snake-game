// Получение элементов DOM.
const startGameBtn = document.getElementById('startGameBtn');
const playBtn = document.getElementById('playBtn');
const gameCanvas = document.getElementById('gameCanvas');
const gameOverDialog = document.getElementById('gameOverDialog');
const restartBtn = document.getElementById('restartBtn');
const scoreElement = document.getElementById('score');
const container = document.getElementById('container');

// Настройки игры.
const ctx = gameCanvas.getContext('2d');
gameCanvas.width = 400;
gameCanvas.height = 400;
const tileSize = 20;

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let gameInterval = null;
let score = 0;

// Генерация новой еды.
function spawnFood() {
    food.x = Math.floor(Math.random() * (gameCanvas.width / tileSize)) * tileSize;
    food.y = Math.floor(Math.random() * (gameCanvas.height / tileSize)) * tileSize;
}

// Обновление интерфейса.
function updateUI() {
    scoreElement.textContent = `Счёт: ${score}`;
}

// Проверка столкновений.
function checkCollision() {
    const head = snake[0];
    // Проверка столкновения со стенкой.
    if (head.x < 0 || head.y < 0 || head.x >= gameCanvas.width || head.y >= gameCanvas.height) {
        endGame();
    }
    // Проверка столкновения с телом.
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

// Окончание игры.
function endGame() {
    clearInterval(gameInterval);
    gameOverDialog.classList.remove('hidden');
    container.classList.add('hidden');

    document.getElementById('finalScore').textContent = `Ваш итоговый счёт: ${score}`;
}

// Основная логика игры.
function gameLoop() {
    const head = { ...snake[0] };
    head.x += direction.x * tileSize;
    head.y += direction.y * tileSize;
    snake.unshift(head);

    // Проверка еды.
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateUI();
        spawnFood();
    } else {
        snake.pop();
    }

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Отрисовка еды.
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, tileSize, tileSize);

    // Отрисовка змейки.
    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, tileSize, tileSize);
    });

    checkCollision();
}

// Начало игры.
function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    updateUI();
    spawnFood();
    gameInterval = setInterval(gameLoop, 200);
}

// Обработка управления.
function handleControls(event) {
    const key = event.key || '';
    switch (key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

// Мобильное управление.
let touchStartX = 0;
let touchStartY = 0;

gameCanvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

gameCanvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction.x === 0) direction = { x: 1, y: 0 };
        else if (deltaX < 0 && direction.x === 0) direction = { x: -1, y: 0 };
    } else {
        if (deltaY > 0 && direction.y === 0) direction = { x: 0, y: 1 };
        else if (deltaY < 0 && direction.y === 0) direction = { x: 0, y: -1 };
    }
});

// Обработчики событий.
startGameBtn.addEventListener('click', () => {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
});

playBtn.addEventListener('click', () => {
    startGame();
    playBtn.style.display = 'none';
});

restartBtn.addEventListener('click', () => {
    container.classList.remove('hidden');
    gameOverDialog.classList.add('hidden');
    playBtn.style.display = 'block';
});

document.addEventListener('keydown', handleControls);
