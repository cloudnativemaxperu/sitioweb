const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasSize = 400;
const gridSize = 20;
const snakeSpeed = 137; 

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let intervalId;
canvas.width = canvasSize;
canvas.height = canvasSize;
function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawSnake();
    drawFood();
}
function drawSnake() {
    snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(segment.x * gridSize, segment.y * gridSize, (segment.x + 1) * gridSize, (segment.y + 1) * gridSize);
        gradient.addColorStop(0, 'red'); 
        gradient.addColorStop(1, 'darkred'); 
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'darkred'; 
        ctx.shadowBlur = 10; 

        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function animateShadow() {
    const offsetX = Math.sin(Date.now() / 100) * 0; 
    const offsetY = Math.cos(Date.now() / 100) * 0; 
    snake.forEach((segment, index) => {
        ctx.fillStyle = 'red'; 
        ctx.shadowColor = 'red'; 
        ctx.shadowBlur = 10; 
        ctx.fillRect(segment.x * gridSize + offsetX, segment.y * gridSize + offsetY, gridSize * 0.8, gridSize * 0.8);
        ctx.strokeStyle = 'black'; 
        ctx.strokeRect(segment.x * gridSize + offsetX, segment.y * gridSize + offsetY, gridSize * 0.8, gridSize * 0.8);
    });
    requestAnimationFrame(animateShadow);
}
animateShadow();

function drawFood() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}
function moveSnake() {
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (newHead.x < 0) {
        newHead.x = canvasSize / gridSize - 1;
    } else if (newHead.x >= canvasSize / gridSize) {
        newHead.x = 0;
    } else if (newHead.y < 0) {
        newHead.y = canvasSize / gridSize - 1;
    } else if (newHead.y >= canvasSize / gridSize) {
        newHead.y = 0;
    }
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        generateFood();
        score++;
        document.getElementById('score').textContent = score;
    } else {
        snake.pop();
    }
}
function generateFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize));
    food.y = Math.floor(Math.random() * (canvasSize / gridSize));
}
function checkCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}
function startGame() {
    document.getElementById('game-title').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';
    document.getElementById('buttons-container').style.display = 'none';
    generateFood();
    score = 0;
    document.getElementById('score').textContent = score;
    intervalId = setInterval(gameLoop, snakeSpeed);
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
    } else { 
        document.addEventListener('keydown', handleKeyPress);
    }
}
function gameLoop() {
    if (checkCollision()) {
        clearInterval(intervalId);
        alert('Game Over! Your score: ' + score);
        document.getElementById('buttons-container').style.display = 'block';
        return;
    }
    moveSnake();
    draw();
}
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    startGame();
}
function handleKeyPress(event) {
    const key = event.keyCode;
    if (key === 37 && dx === 0) { 
        dx = -1;
        dy = 0;
    } else if (key === 38 && dy === 0) { 
        dx = 0;
        dy = -1;
    } else if (key === 39 && dx === 0) { 
        dx = 1;
        dy = 0;
    } else if (key === 40 && dy === 0) { 
        dx = 0;
        dy = 1;
    }
}
function handleTouchStart(event) {
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = touchX - canvasRect.left;
    const canvasY = touchY - canvasRect.top;
    const headX = snake[0].x * gridSize;
    const headY = snake[0].y * gridSize;

    if (Math.abs(canvasX - headX) > Math.abs(canvasY - headY)) {
        if (canvasX > headX && dx === 0) {
            dx = 1;
            dy = 0;
        } else if (canvasX < headX && dx === 0) {
            dx = -1;
            dy = 0;
        }
    } else {
        if (canvasY > headY && dy === 0) {
            dx = 0;
            dy = 1;
        } else if (canvasY < headY && dy === 0) {
            dx = 0;
            dy = -1;
        }
    }
}
function handleTouchMove(event) {
    event.preventDefault(); 
}
document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector('body');
    const dotsCount = 100; 
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.style.left = Math.random() * 100 + 'vw'; 
        dot.style.top = Math.random() * 100 + 'vh'; 
        body.appendChild(dot);
    }
    document.getElementById('restart-button').addEventListener('click', restartGame);
    //startGame(); // Iniciar el juego al cargar la página
});
