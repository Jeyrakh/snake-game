document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const gameContainer = document.querySelector("#game-container");
  const scoreElement = document.querySelector("#score");
  const resetButton = document.querySelector("#reset");
  
  let width = 600; // ширина поля игры
  let height = 400; // высота поля игры
  let cellSize = 20; // размер «клеток»
  let direction = "RIGHT";
  let snake = [{ x: 60, y: 100 }];
  let apple = generateApple();
  let score = 0;
  let running = false;

  canvas.width = width;
  canvas.height = height;
  gameContainer.appendChild(canvas);

  function startGame() {
    running = true;
    drawBoard();
    updateGame();
  }

  function resetGame() {
    running = false;
    direction = "RIGHT";
    snake = [{ x: 60, y: 100 }];
    apple = generateApple();
    score = 0;
    scoreElement.textContent = `Счёт: ${score}`;
    drawBoard();
  }

  function drawBoard() {
    context.clearRect(0, 0, width, height);
  
    // Фон
    context.fillStyle = "#f8f9fa";
    context.fillRect(0, 0, width, height);

    // Яблоко
    context.fillStyle = "red";
    context.beginPath();
    context.arc(apple.x + cellSize / 2, apple.y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
    context.fill();

    // Змейка
    context.fillStyle = "green";
    snake.forEach(({ x, y }) => {
      context.beginPath();
      context.roundRect(x, y, cellSize, cellSize, 5);
      context.fill();
    });
  }

  function generateApple() {
    return {
      x: Math.floor(Math.random() * (width / cellSize)) * cellSize,
      y: Math.floor(Math.random() * (height / cellSize)) * cellSize,
    };
  }

  function updateGame() {
    if (!running) return;

    const head = { ...snake[0] };

    switch (direction) {
      case "RIGHT":
        head.x += cellSize;
        break;
      case "LEFT":
        head.x -= cellSize;
        break;
      case "UP":
        head.y -= cellSize;
        break;
      case "DOWN":
        head.y += cellSize;
        break;
    }

    // Проверка столкновений
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= width ||
      head.y >= height ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      alert(`Вы проиграли! Ваш итоговый счёт: ${score}`);
      resetGame();
      return;
    }

    snake.unshift(head);

    // Проверка на поедание яблока
    if (head.x === apple.x && head.y === apple.y) {
      apple = generateApple();
      score++;
      scoreElement.textContent = `Счёт: ${score}`;
    } else {
      snake.pop(); // Удаляем хвост, если не съедено яблоко
    }

    drawBoard();
    setTimeout(updateGame, 100); // Скорость игры
  }

  function changeDirection(event) {
    const { key } = event;
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  }

  document.addEventListener("keydown", changeDirection);
  resetButton.addEventListener("click", resetGame);

  // Основной старт игры
  drawBoard();
  gameContainer.querySelector("button").addEventListener("click", startGame);
});
