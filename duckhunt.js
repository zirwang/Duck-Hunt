//Duck image width and height
var duckSize = 65;
//Array of duck objects
var ducks = [];
//Determines how oftern the updata logic function runs
var frameRate = 30;
//Determines when ducks pick a new target
var targetChangeCount = 0;
//Determines when ducks change sprites so they appear to flap
var duckFlapCount = 0;
//Determines when the player loses
var gameOverCount = 1000;
//Game states are "PLAY", "GAMEOVER", and "TEXT"
var gameState = "TEXT";
//Level of game determines number of ducks, speed of ducks, etc
var level = 0;
var score = 0;
var shots = 3;
//Init game
window.onload = function() {
	//setup mouse event handler
	var canvas = document.getElementById("game");
	canvas.addEventListener("mousedown",handleClick,false);
	//schedule game logic update
	setInterval(updateGameLogic,1000/frameRate);
}

//Sound assets
var quackSound = new Audio("quack.mp3");
var startSound = new Audio("start.mp3");
var shootSound = new Audio("shoot.mp3");
var nextLevelSound = new Audio("nextLevel.mp3");
var loseSound = new Audio("lose.mp3");

$(document).ready(function(e){
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var audio = document.createElement('audio');
  canvas.width = 700;
  canvas.height= 550;
  drawLives();
});

// DRAW LIVES & Draws points
function drawLives() {
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    var life1 = new Image();
    var life2 = new Image();
    var life3 = new Image();
    life1.onload = function() {
		 var temp = "Score: " + String(score);
     ctx.imageSmoothingEnabled = false;
     ctx.drawImage(this, 10, 500, 40, 30);
		 ctx.font = "20px Georgia";
		 ctx.fillText(temp, 550, 520);
   };
   life2.onload = function() {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this, 60, 500, 40, 30);
  };
  life3.onload = function() {
   ctx.imageSmoothingEnabled = false;
   ctx.drawImage(this, 110, 500, 40, 30);

 };
 if(shots == 3){
	 life1.src = "heart.png";
   life2.src = "heart.png";
   life3.src = "heart.png";
 }
 else if(shots == 2){
	 life1.src = "heart.png";
   life2.src = "heart.png";
 }
 else if(shots == 1){
	 life1.src = "heart.png";
 }


}

//Handles mouse click to progress screen or shoot duck
function handleClick(event) {
	if (gameState == "TEXT") {
		//increase level and go to play state
		level++;
		//Make game over happen quicker
		gameOverCount = 1000 - 50*level;
		if (gameOverCount < 100)
			gameOverCount = 100; //100 is hard enough

		generateDucks();
		gameState = "PLAY";
	}
	else if (gameState == "PLAY") {
		//Play sound
		shootSound.play();
		//Flash screen white and check if duck was hit
		var canvas = document.getElementById("game");
		var ctx = canvas.getContext("2d");

		//Flashes white
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,canvas.width, canvas.height);

		//checks if duck was hit and removes it if necessary
		checkDuckHit(event);

		//check if all ducks are gone
		if (ducks.length == 0) {
			gameState = "TEXT";
			//Play next level sound
			nextLevelSound.play();
		}

	}
	else if (gameState == "GAMEOVER") {
		//Replay
		level = 0;
		score = 0;
		shots = 3;
		//clear out ducks array
		ducks = [];
		gameState = "TEXT";
	}

}

//Draws the string to the canvas.  Boolean determines if the screen should clear first
function drawText(message,clear) {
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext('2d');

	//clear
	if (clear)
		ctx.clearRect(0,0,canvas.width,canvas.height);
	//Draw message
	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(message, canvas.width/3, canvas.height/3);

}

//Creates new ducks
function generateDucks() {
	for (i=0; i < 2; i++) {
		ducks.push( {posX: Math.random()*750, posY: Math.random()*500, targetX: Math.random()*750, targetY: Math.random()*500} );
	}
}

//Checks if a click is in any ducks hit box and removes those ducks
function checkDuckHit(event) {
	//Get click coordinates
	var x = 0;
	var y = 0;
  var hit = false;
	var canvas = document.getElementById("game");

	//Get coordinates of click
	x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

	//Adjust to canvas coordinates
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	//Iterate over ducks
	for (i=0; i < ducks.length; i++) {
		//xcoordinate check
		if (x > ducks[i].posX && x < ducks[i].posX + duckSize) {
			//ycoordinate check
			if(y > ducks[i].posY && y < ducks[i].posY + duckSize) {
				//Duck was hit, remove it
				ducks.splice(i,1);
				hit = true;
				score +=100;
			}
		}
	}
	if(hit === false){
		shots--;

	}

}

//Clears screen and draws all ducks
function drawDucks() {
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext('2d');

	//Quack occasionally
	if (Math.random() < .05)
		quackSound.play();

	//clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);

	//Iterate over ducks
	for (i=0; i < 2; i++) {
		duckImage = new Image();
		//Switch direction duck faces based on target
		if (ducks[i].targetX > ducks[i].posX) {
			//Flap animation frame select
			if (duckFlapCount % 14 < 7)
				duckImage.src = "duck1right.png";
			else duckImage.src = "duck2right.png";
		} else {

			if (duckFlapCount % 14 < 7)
				duckImage.src = "duck1left.png";
			else duckImage.src = "duck2left.png";
		}
		//Once loaded already, draws images
		ctx.drawImage(duckImage,ducks[i].posX,ducks[i].posY,duckSize,duckSize);
		//Draws the first time the windows loads
		duckImage.onload = function() {
			ctx.drawImage(duckImage,ducks[i].posX,ducks[i].posY,duckSize,duckSize);
		}
	}

}

//Randomly sets new targets for all ducks
function updateTargets() {
	for (i=0; i < ducks.length; i++) {
		ducks[i].targetX = Math.random() * (750-duckSize);
		ducks[i].targetY = Math.random() * 500;
	}
}

//Move ducks offscreen when game over
function setDucksLeave() {
	var canvas = document.getElementById("game");

	for (i=0; i < ducks.length; i++) {
		ducks[i].targetX = canvas.width/2;
		ducks[i].targetY = -5*duckSize;
	}
}

//Moves all ducks 1/20 of the way towards their target
function moveDucks() {
	for (i=0; i < ducks.length; i++) {
		var differenceX = ducks[i].targetX - ducks[i].posX;
		var differenceY = ducks[i].targetY - ducks[i].posY;

		ducks[i].posX += differenceX/20;
		ducks[i].posY += differenceY/20;
	}
}

function updateGameLogic() {
	drawLives();

	if (gameState == "TEXT") {
		if (level == 0)
			drawText("Click to play!",true);
		else {
			drawText("Level " + (level+1).toString() + "!",true);
		}
	}
	else if (gameState == "PLAY") {
		//Update count for flap animation
		duckFlapCount++;
		//update targets
		targetChangeCount++;
		if (targetChangeCount % 50 == 0)
			updateTargets();
		//move and redraw
		moveDucks();
		drawDucks();
		//Decrease count toward losing
		gameOverCount--;
		//Check if gameover
		if (gameOverCount == 0 || shots <= 0) {
			gameState = "GAMEOVER";
			//send ducks to fly offscreen
			setDucksLeave();
		}
	}
	else if (gameState == "GAMEOVER") {
		//Update count for flap animation
		duckFlapCount++;
		//Move ducks off screen
		moveDucks();
		drawDucks();
		drawText("Game Over! Final Score: " + score + "!" , false);

	}

}
