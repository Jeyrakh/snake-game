document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    let gridSize = 20;
    let count = 0;
    let snake = {
        x: 160,
        y: 160,
        dx: gridSize,
        dy: 0,
        cells: [],
        maxCells: 4
    };
    let apple = {
        x: 320,
        y: 320
    };
    let score = 0;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function resetGame() {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = gridSize;
        snake.dy = 0;
        score = 0;
        placeApple();
    }

    function placeApple() {
        apple.x = getRandomInt(0, 25) * gridSize;
        apple.y = getRandomInt(0, 25) * gridSize;
    }

    function gameOver() {
        alert(`Game over! Score: ${score}`);
        resetGame();
    }

    function loop() {
        requestAnimationFrame(loop);
        if (++count < 4) {
            return;
        }
        count = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
            gameOver();
        }

        snake.cells.unshift({ x: snake.x, y: snake.y });
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        ctx.fillStyle = "red";
        ctx.fillRect(apple.x, apple.y, gridSize, gridSize);

        ctx.fillStyle = "green";
        snake.cells.forEach((cell, index) => {
            ctx.fillRect(cell.x, cell.y, gridSize, gridSize);
            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                score++;
                placeApple();
            }
            for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    gameOver();
                }
            }
        });
    }

    function onKeyDown(e) {
        if (e.key === "ArrowLeft" && snake.dx === 0) {
            snake.dx = -gridSize;
            snake.dy = 0;
        } else if (e.key === "ArrowUp" && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = -gridSize;
        } else if (e.key === "ArrowRight" && snake.dx === 0) {
            snake.dx = gridSize;
            snake.dy = 0;
        } else if (e.key === "ArrowDown" && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = gridSize;
        }
    }

    function onTouchStart(e) {
        let touchStartX = e.touches[0].clientX;
        let touchStartY = e.touches[0].clientY;

        function onTouchMove(e) {
            let touchEndX = e.changedTouches[0].clientX;
            let touchEndY = e.changedTouches[0].clientY;

            let dx = touchEndX - touchStartX;
            let dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && snake.dx === 0) {
                    snake.dx = gridSize;
                    snake.dy = 0;
                } else if (dx < 0 && snake.dx === 0) {
                    snake.dx = -gridSize;
                    snake.dy = 0;
                }
            } else {
                if (dy > 0 && snake.dy === 0) {
                    snake.dx = 0;
                    snake.dy = gridSize;
                } else if (dy < 0 && snake.dy === 0) {
                    snake.dx = 0;
                    snake.dy = -gridSize;
                }
            }

            document.removeEventListener("touchmove", onTouchMove);
        }

        document.addEventListener("touchmove", onTouchMove);
    }

    function setup() {

        canvas.width = 500;
        canvas.height = 500;
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("touchstart", onTouchStart);
        placeApple();
        requestAnimationFrame(loop);
    }

    setup();
});
