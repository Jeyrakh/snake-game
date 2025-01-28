document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const box = 20; // Размер одной клеточки змейки
    const canvasSize = 400; // Размер игрового поля
    let snake = [{ x: box * 3, y: box * 3 }];
    let direction = 'right';
    let food = { x: Math.floor((Math.random() * canvasSize) / box) * box, y: Math.floor((Math.random() * canvasSize) / box) * box };
    let score = 0;
    let gameInterval;

    // Обработка нажатий клавиш
    document.addEventListener('keydown', changeDirection);

    // Обработка касаний на экране (например, свайпы)
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    let xDown = null;
    let yDown = null;

    function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        let xUp = evt.touches[0].clientX;
        let yUp = evt.touches[0].clientY;

        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) { // most significant
            if (xDiff > 0) {
                direction = 'left';
            } else {
                direction = 'right';
            }
        } else {
            if (yDiff > 0) {
                direction = 'up';
            } else {
                direction = 'down';
            }
        }
        xDown = null;
        yDown = null;
    };

    function changeDirection(event) {
        if (event.keyCode === 37 && direction !== 'right') {
            direction = 'left';
        } else if (event.keyCode === 38 && direction !== 'down') {
            direction = 'up';
        } else if (event.keyCode === 39 && direction !== 'left') {
            direction = 'right';
        } else if (event.keyCode === 40 && direction !== 'up') {
            direction = 'down';
        }
    }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) {
                return true;
            }
        }
        return false;
    }

    function draw() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction === 'right') snakeX += box;
        if (direction === 'left') snakeX -= box;
        if (direction === 'up') snakeY -= box;
        if (direction === 'down') snakeY += box;

        if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision({ x: snakeX, y: snakeY }, snake)) {
            clearInterval(gameInterval);
            ctx.fillStyle = 'black';
            ctx.font = '50px Arial';
            ctx.fillText('Game Over', canvasSize / 5, canvasSize / 2);
            return;
        }

        if (snakeX === food.x && snakeY === food.y) {
            score++;
            food = {
                x: Math.floor((Math.random() * canvasSize) / box) * box,
                y: Math.floor((Math.random() * canvasSize) / box) * box
            }
        } else {
            snake.pop();
        }

        let newHead = { x: snakeX, y: snakeY };
        snake.unshift(newHead);

        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, box, box);
    }

    document.getElementById('startGameButton').addEventListener('click', function() {
        clearInterval(gameInterval);
