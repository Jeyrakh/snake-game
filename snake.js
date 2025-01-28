const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const controls = document.getElementById('controls');
const gameOverDiv = document.getElementById('game-over');
const gameOverText = document.getElementById('game-over-text');
const scoreElement = document.getElementById('score');

canvas.width = 400;
canvas.height = 400;

let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
];

let dx = 10;
let dy = 0;

let changingDirection = false;
let foodX;
let foodY;
let score = 0;
let gameInterval;

document.addEventListener('keydown', changeDirection);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

function showGame() {
    startButton.classList.add('hide');
    gameContainer.classList.remove('hide');
    controls.classList.remove('hide');
}

function startGame() {
    controls.classList.add('hide');
    gameOverDiv.classList.add('hide');
    score = 0;
    scoreElement.innerText = score;
    resetSnake();
    createFood();
    gameInterval = setInterval(main, 100);
}

function resetSnake() {
    snake = [
        {x: 200, y: 200},
        {x: 190, y: 200},
        {x: 180, y: 200},
        {x: 170, y: 200},
        {x: 160, y: 200}
    ];
    dx = 10;
    dy = 0;
    changingDirection = false;
}

function main() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        gameOver();
        return;
    }

    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = '#fafafa';
    ctx.strokestyle = '#4caf50';

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = '#4caf50';
    ctx.strokestyle = '#ffffff';

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;

    if (didEatFood) {
        score += 10;
        scoreElement.innerText = score;
        createFood();
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function createFood() {
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);

    snake.forEach(function(part) {
        const hasEaten = part.x == foodX && part.y == foodY;
        if (hasEaten) createFood();
    });
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.strokestyle = '#ffffff';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

let initialX = null;
let initialY = null;

function handleTouchStart(event) {
    const firstTouchEvent = event.touches[0];
    initialX = firstTouchEvent.clientX;
    initialY = firstTouchEvent.clientY;
}

function handleTouchMove(event) {
    if (!initialX || !initialY) {
        return;
    }

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;

    const diffX = initialX - currentX;
    const diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Mostly horizontal gesture
        if (diffX > 0 && dx !== 10) {
            dx = -10;
            dy = 0;
        } else if (diffX < 0 && dx !== -10) {
            dx = 10;
            dy = 0;
        }
    } else {
        // Mostly vertical gesture
        if (diffY > 0 && dy !== 10) {
            dx = 0;
            dy = -10;
        } else if (diffY < 0 && dy !== -10) {
