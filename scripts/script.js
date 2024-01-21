//board
let board;
const boardWidth = 288;
const boardHeight = 512;
let context;

//bird
let birdWidth;
let birdHeight;
let birdX;
let birdY;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2D");
}