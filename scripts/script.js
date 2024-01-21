//board
let board;
const boardWidth = 288;
const boardHeight = 512;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage;


//pipes
const pipeWidth = 52;
const pipeHeight = 320;
let pipeX;
let pipeY;
let pipeImageTop;
let pipeImageBottom;
const pipeArray = [];

const velocityX = 2;
const gravity = 0.4;
let velocityY = 0;

let gameOver = false;
let score = 0; 

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    birdImage = new Image();
    birdImage.src = "../assets/yellowbird-downflap.png";
    birdImage.onload = function() {
        context.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);
    }

    pipeX = boardWidth;
    pipeY = 0;

    pipeImageTop = new Image();
    pipeImageTop.src = "../assets/pipe-green-top.png"
    pipeImageTop.onload = function() {
        context.drawImage(pipeImageTop, pipeX, pipeY, pipeWidth, pipeHeight)
    }

    pipeImageBottom = new Image();
    pipeImageBottom.src = "../assets/pipe-green-bottom.png"
    pipeImageBottom.onload = function() {
        context.drawImage(pipeImageBottom, pipeX, pipeY + pipeWidth + 90, pipeWidth, pipeHeight)
    }

    requestAnimationFrame(update);
    setInterval(createPipe, 1500);

    document.addEventListener("keydown", function(key) {
        if (key.code === "Space") {
            velocityY = -6;
        }
    });
}

function update() {
    if (gameOver) {
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0, 0, boardWidth, boardHeight);

    //bird
    velocityY += gravity;
    birdY = Math.max(birdY + velocityY, 0);
    context.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

    if (birdY > boardHeight) {
        gameOver = true;
    }


    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)
        pipe.x -= velocityX;

        let bird = {
            x: birdX,
            y: birdY,
            width: birdWidth,
            height: birdHeight
        };

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (checkCollisions(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length !== 0 && pipeArray[0].x < 0 - pipeArray[0].width) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
}

function createPipe() {
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let gap = boardHeight / 4;

    let topPipe = {
        img: pipeImageTop,
        width: pipeWidth,
        height: pipeHeight,
        x: pipeX,
        y: randomPipeY,
        passed: false
    }

    let bottomPipe = {
        img: pipeImageBottom,
        width: pipeWidth,
        height: pipeHeight,
        x: pipeX,
        y: randomPipeY + pipeHeight + gap,
        passed: false
    };

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

function checkCollisions(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

