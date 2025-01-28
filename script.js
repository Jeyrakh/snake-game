document.addEventListener('DOMContentLoaded', () => {
    const startGameBtn = document.getElementById('start-game-btn');
    const playBtn = document.getElementById('play-btn');
    const gameBoardCanvas = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const gameContainer = document.getElementById('game');
    
    const ctx = gameBoardCanvas.getContext('2d');
    let score = 0;
    let snake = [{x: 5, y: 5}];
    let food = {};
    const cellSize = 20;
    let direction = 'RIGHT';
    let gameInterval;

    function init() {
        gameBoardCanvas.width = 400;
        gameBoardCanvas.height = 400;
        snake = [{x: 5, y: 5}];
        direction = 'RIGHT';
        createFood();
        score = 0;
        playBtn.classList.remove('hidden');
        scoreDisplay.textContent = 'Счёт: 0';
    }

    function createFood() {
        food.x = Math.floor(Math.random() * (gameBoardCanvas.width / cellSize));
        food.y = Math.floor(Math.random() * (gameBoardCanvas.height / cellSize));
    }

    function drawCell(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }

    function drawGame() {
        ctx.clearRect(0, 0, gameBoardCanvas.width, gameBoardCanvas.height);
        snake.forEach(part => drawCell(part.x, part.y, '#ffffff'));
        drawCell(food.x, food.y, '#ff4d4d');
    }

    function moveSnake() {
        const head = {...snake[0]};
        switch (direction) {
            case 'RIGHT': head.x++; break;
            case 'LEFT': head.x--; break;
            case 'UP': head.y--; break;
            case 'DOWN': head.y++; break;
        }
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = `Счёт: ${score}`;
            createFood();
        } else {
            snake.pop();
        }

        if (head.x < 0 || head.x >= gameBoardCanvas.width / cellSize || head.y < 0 || head.y >= gameBoardCanvas.height / cellSize ||
            snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
            clearInterval(gameInterval);
            alert('Игра окончена! Ваш счёт: ' + score);
            init();
        }
    }

    function changeDirection(event) {
        if ((event.key === 'ArrowUp' || event.key === 'w') && direction !== 'DOWN') direction = 'UP';
        if ((event.key === 'ArrowDown' || event.key === 's') && direction !== 'UP') direction = 'DOWN';
        if ((event.key === 'ArrowLeft' || event.key === 'a') && direction !== 'RIGHT') direction = 'LEFT';

        if ((event.key === 'ArrowRight' || event.key === 'd') && direction !== 'LEFT') direction = 'RIGHT';
    }

    function handleTouch(event) {
        const touch = event.touches[0];
        const moveX = touch.clientX;
        const moveY = touch.clientY;
        const snakeHead = snake[0];

        if (moveX > snakeHead.x * cellSize && direction !== 'LEFT' && direction !== 'RIGHT') {
            direction = 'RIGHT';
        } else if (moveX < snakeHead.x * cellSize && direction !== 'RIGHT' && direction !== 'LEFT') {
            direction = 'LEFT';
        } else if (moveY > snakeHead.y * cellSize && direction !== 'UP' && direction !== 'DOWN') {
            direction = 'DOWN';
        } else if (moveY < snakeHead.y * cellSize && direction !== 'DOWN' && direction !== 'UP') {
            direction = 'UP';
        }
    }

    startGameBtn.addEventListener('click', () => {
        gameContainer.classList.remove('hidden');
        startGameBtn.classList.add('hidden');
        init();
    });

    playBtn.addEventListener('click', () => {
        playBtn.classList.add('hidden');
        gameInterval = setInterval(() => {
            moveSnake();
            drawGame();
        }, 100);
    });

    document.addEventListener('keydown', changeDirection);
    gameBoardCanvas.addEventListener('touchstart', handleTouch);
});
