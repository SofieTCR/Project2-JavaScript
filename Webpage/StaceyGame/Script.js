var blockSize = 25; 
var total_row = 20; //aantal rijen
var total_col = 20; //aantal kolommen
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var speedX = 0; //snelheid slang X coordinaten
var speedY = 0; //snelheid slang Y coordinaten

var snakeBody = [];

var foodX;
var foodY;

var gameOver = false;

window.onload = function () {
	// canvas height en width
	board = document.getElementById("board");
	board.height = total_row * blockSize;
	board.width = total_col * blockSize;
	context = board.getContext("2d");

	placeFood();
	document.addEventListener("keyup", changeDirection);
	// slang snelte
	setInterval(update, 1000 / 8);
}

function update() {
	if (gameOver) {
		return;
	}

	// achtergrond
	context.fillStyle = "#343434";
	context.fillRect(0, 0, board.width, board.height);

	// appel kleur en positie
	context.fillStyle = "#E0435A";
	context.fillRect(foodX, foodY, blockSize, blockSize);

	if (snakeX == foodX && snakeY == foodY) {
		snakeBody.push([foodX, foodY]);
		placeFood();
	}

	// lichaam wordt langer
	for (let i = snakeBody.length - 1; i > 0; i--) {
		snakeBody[i] = snakeBody[i - 1];
	}
	if (snakeBody.length) {
		snakeBody[0] = [snakeX, snakeY];
	}

	context.fillStyle = "#5CC43F";
	snakeX += speedX * blockSize; //update slang positie X coords
	snakeY += speedY * blockSize; //update slang positie Y coords
	context.fillRect(snakeX, snakeY, blockSize, blockSize);
	for (let i = 0; i < snakeBody.length; i++) {
		context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
	}

			// border detecteren
	if (snakeX < 0
		|| snakeX > total_col * blockSize - blockSize
		|| snakeY < 0
		|| snakeY > total_row * blockSize - blockSize) {
		
		gameOver = true;
		deathPopup();

	}

				// slang contact detecteren
	for (let i = 0; i < snakeBody.length; i++) {
		if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
			
			gameOver = true;
			deathPopup();
		}
	}
}

function deathPopup()
{
 var el = document.createElement("div");
 el.setAttribute("style","position:absolute;top:45%; width: 99.5vw; display: flex; justify-content: center; font-size: 80px; color: #E0435A; padding: 0px; margin: 0px; font-family: Times New Roman;");
 el.innerHTML = "Game Over";
 document.body.appendChild(el);
}

// beweging slang controls
function changeDirection(e) {
    console.log(e.code);
	if (e.code == "KeyW" && speedY != 1) {
		speedX = 0;
		speedY = -1;
	}
	else if (e.code == "KeyS" && speedY != -1) {
		speedX = 0;
		speedY = 1;
	}
	else if (e.code == "KeyA" && speedX != 1) {
		speedX = -1;
		speedY = 0;
	}
	else if (e.code == "KeyD" && speedX != -1) {
		speedX = 1;
		speedY = 0;
	}
    else if (e.code == "KeyR") {
        location.reload();
    }
}

// appel plaatsing
function placeFood() {

	// in X coords
	foodX = Math.floor(Math.random() * total_col) * blockSize;
	
	//in Y coords
	foodY = Math.floor(Math.random() * total_row) * blockSize;
}
