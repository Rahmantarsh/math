const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let car = {
    x: 50,
    y: 0,
    speed: 2,
    index: 0,
    angle: 0,
    image: new Image()
};
car.image.src = "car.png";

let correctSound = new Audio("soundcar.wav");
correctSound.load();

let path = generatePath();
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let gameInterval;

function generatePath() {
    let path = [];
    let x = 50;
    let direction = 1;
    let stepY = 50;
    let stepX = 700;

    for (let y = 0; y < canvas.height; y += stepY) {
        path.push({ x, y });
        x += direction * stepX;
        direction *= -1;
    }
    return path;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 8;
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();

    if (car.index < path.length - 1) {
        let nextPoint = path[car.index + 1];
        let currentPoint = path[car.index];

        let dx = nextPoint.x - currentPoint.x;
        let dy = nextPoint.y - currentPoint.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        car.angle = Math.atan2(dy, dx);
        car.x += (dx / distance) * car.speed;
        car.y += (dy / distance) * car.speed;

        if (Math.abs(car.x - nextPoint.x) < 5 && Math.abs(car.y - nextPoint.y) < 5) {
            car.index++;
        }
    } else {
        endGame();
    }

    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.drawImage(car.image, -25, -25, 50, 50);
    ctx.restore();
}

function startGame() {
    score = 0;
    totalQuestions = 0;
    correctAnswers = 0;
    document.getElementById("score").textContent = score;

    car.index = 0;
    car.x = path[0].x;
    car.y = path[0].y;
    car.speed = 2;

    gameInterval = setInterval(drawGame, 30);

    generateQuestion();
}

function endGame() {
    clearInterval(gameInterval);

    let accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100).toFixed(2) : 0;
    alert(`🎉 Game Over!\n🏆 Your Score: ${score}\n📊 Accuracy: ${accuracy}%`);

    startGame();
}

function generateQuestion() {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let correctAnswer = num1 + num2;
    let options = [correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 2].sort(() => Math.random() - 0.5);
    
    document.getElementById("question").textContent = `${num1} + ${num2} = ?`;
    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    options.forEach((option) => {
        let button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option, correctAnswer);
        optionsContainer.appendChild(button);
    });

    totalQuestions++;
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        correctSound.pause();
        correctSound.currentTime = 0;
        correctSound.play();

        score += 10;
        car.speed += 0.5;
        correctAnswers++;
        document.getElementById("score").textContent = score;
    }
    generateQuestion();
}

window.onload = startGame;
