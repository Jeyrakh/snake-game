// Предотвращаем обновление страницы при случайном свайпе на сенсорном экране
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });

// Получаем HTML элементы и задаем контекст рисования
const canvas = document.getElementById('gameCanvas'); // Канвас для отрисовки
const ctx = canvas.getContext('2d'); // Контекст для 2D рисования
const startButton = document.getElementById('start-game'); // Кнопка для начала игры
const restartButton = document.getElementById('restart-game'); // Кнопка для рестарта игры
const menu = document.querySelector('.menu'); // Меню игры
const gameOverScreen = document.getElementById('game-over'); // Экран окончания игры
const finalScore = document.getElementById('final-score'); // Элемент отображения финального счета

// Переменные для игры
let snake; // Змейка
let direction; // Текущее направление движения
let apple; // Позиция яблока
let score; // Текущий счет

const backgroundImage = new Image();
backgroundImage.src = 'https://github.com/Jeyrakh/snake-game/blob/main/%D0%A0%D0%B0%D1%81%D1%83%D0%BB1.jpg?raw=true'; // Замените на путь к вашему изображению

backgroundImage.onload = function() {
    // Только после загрузки изображения можно инициализировать игру
    startButton.addEventListener('click', initGame);
    restartButton.addEventListener('click', initGame);
};

// Функция для начала игры
function initGame() {
  // Показываем канвас, скрываем меню и экран окончания игры
  canvas.style.display = 'block';
  menu.style.display = 'none';
  gameOverScreen.style.display = 'none';

  // Инициализация начального состояния игры
  snake = [{ x: 200, y: 200 }]; // Стартовая позиция змейки
  direction = { x: 10, y: 0 }; // Змейка начинает двигаться вправо
  apple = placeApple(); // Генерация первого яблока
  score = 0; // Начальный счет

  // Запускаем игровой цикл
  window.requestAnimationFrame(gameLoop);
}

// Игровой цикл
function gameLoop() {
  if (isGameOver()) {
    // Проверяем, закончилась ли игра
    endGame(); // Если закончилась, завершаем
    return;
  }

  setTimeout(() => {
    update(); // Обновляем состояние игры
    draw(); // Рисуем текущее состояние
    window.requestAnimationFrame(gameLoop); // Повторяем цикл
  }, 50); // Задержка между кадрами (скорость игры)
}

// Обновление состояния игры
function update() {
  const head = snake[0]; // Голова змейки
  const newHead = { x: head.x + direction.x, y: head.y + direction.y }; // Новая позиция головы

  // Проверяем, съедено ли яблоко
  if (newHead.x === apple.x && newHead.y === apple.y) {
    score += 1; // Увеличиваем счет
    apple = placeApple(); // Генерируем новое яблоко
  } else {
    snake.pop(); // Если яблоко не съедено, удаляем последний сегмент змейки (хвост)
  }

  snake.unshift(newHead); // Добавляем новую голову в начале массива
}

// Отрисовка игры
function draw() {
  // Рисуем фоновое изображение
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Рисуем яблоко как эмодзи 🍎
  ctx.font = '10px Arial'; // Убедитесь, что шрифт крупнее или меньше, в зависимости от желаемого размера эмодзи
  ctx.fillText('🍎', apple.x, apple.y + 10); // Прибавьте 20 пикселей к y, чтобы центрировать эмодзи по вертикали

  // Рисуем змейку
  ctx.fillStyle = '#4CAF50'; // Зеленый цвет змейки
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, 10, 10); // Каждый сегмент размером 20x20 пикселей
  });

  // Рисуем счет
  ctx.fillStyle = '#ffffff'; // Черный цвет текста
  ctx.font = '15px Arial'; // Шрифт текста
  ctx.fillText(`Помидоров: ${score}`, 10, 20); // Вывод счета в верхнем левом углу
}

// Проверяем, закончилась ли игра
function isGameOver() {
  const head = snake[0]; // Позиция головы змейки

  // Проверяем столкновение с краями канваса
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    return true;
  }

  // Проверяем столкновение головы с хвостом
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false; // Если нет никакого столкновения, игра продолжается
}


// Завершаем игру
function endGame() {
  canvas.style.display = 'none'; // Скрываем канвас
  gameOverScreen.style.display = 'block'; // Показываем экран окончания игры
  finalScore.textContent = score; // Отображаем финальный счет
}


// Генерация нового расположения яблока
function placeApple() {
  // Выбираем случайные координаты кратные 20
  const x = Math.floor((Math.random() * canvas.width) / 10) * 10;
  const y = Math.floor((Math.random() * canvas.height) / 10) * 10;
  return { x, y }; // Возвращаем координаты яблока
}

// Обработчик направления по сенсору (касания)
function getTouchDirection(touchStart, touchEnd) {
  const deltaX = touchEnd.x - touchStart.x; // Разница по оси X
  const deltaY = touchEnd.y - touchStart.y; // Разница по оси Y
  
  // Определяем направление на основе движений
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) return { x: 10, y: 0 }; // Движение вправо
    else return { x: -10, y: 0 }; // Движение влево
  } else {
    if (deltaY > 0) return { x: 0, y: 10 }; // Движение вниз
    else return { x: 0, y: -10 }; // Движение вверх
  }
}

let touchStartCoord = null; // Для хранения начала касания

// Событие начала касания
canvas.addEventListener('touchstart', (e) => {
  touchStartCoord = { x: e.touches[0].clientX, y: e.touches[0].clientY }; // Сохраняем стартовую позицию касания
});

// Событие окончания касания
canvas.addEventListener('touchend', (e) => {
  const touchEndCoord = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }; // Сохранение конечной позиции касания
  const newDirection = getTouchDirection(touchStartCoord, touchEndCoord); // Определяем направление на основе касания

  // Изменяем направление, если это возможно
  if ((newDirection.x !== 0 && direction.x === 0) || (newDirection.y !== 0 && direction.y === 0)) {
    direction = newDirection;
  }
});

// Обработчик клавиш
document.addEventListener('keydown', (e) => {
  const key = e.key;

  // Изменяем направление в зависимости от нажатой клавиши
  if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -10 };
  else if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 10 };
  else if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -10, y: 0 };
  else if (key === 'ArrowRight' && direction.x === 0) direction = { x: 10, y: 0 };
});

// Навешиваем события на кнопки начала и рестарта
startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);
