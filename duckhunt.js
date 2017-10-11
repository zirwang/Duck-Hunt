//Duck image width and height for checking if a duck was hit
//Duck array to keep track of the two ducks and their positions
//Makes sprite change to simulate flapping
//How often the ducks pick a new target to travel to
var duckSize = 60;
var ducks = [];
var flapCount = 0;
var targetChange = 0;
//Timer for how long the player has to hit both ducks
var gameTime = 1000;
//Sets game state to initial text of click to hunt ducks. Other states: "PLAY", and "GAMEOVER"
var gameState = "READY";
//Level of game determines how long to hit ducks
//score increases by 100 points per duck hit
var level = 0;
var score = 0;
var shots = 3;

//Game Initialization
window.onload = function() {
	//setup mouse event handler
	var canvas = document.getElementById("game");
	canvas.addEventListener("mousedown",handleClick,false);
	//schedule game logic update
	setInterval(updateGameLogic,1000/30);

}

//Sounds
var quack = new Audio("sounds/quack.mp3");
var startSound = new Audio("sounds/startSong.mp3");
var shootSound = new Audio("sounds/gunShot.mp3");
var nextLevelSound = new Audio("sounds/levelUp.mp3");

$(document).ready(function(e){
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var audio = document.createElement('audio');
  canvas.width = 700;
  canvas.height = 550;
  startSound.play();
});

// Draws lives & Draws score onto the canvas
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
	     ctx.font = "25px serif";
	     ctx.fillStyle = "white";
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
   life1.src = "images/heart.png";
   life2.src = "images/heart.png";
   life3.src = "images/heart.png";
 }
 else if(shots == 2){
   life1.src = "images/heart.png";
   life2.src = "images/heart.png";
 }
 else if(shots == 1){
	 life1.src = "images/heart.png";
 }


}

//Handles mouse click check if duck was hit
//Screen flashes red to simulate a possible killed duck
function handleClick(event) {
	if (gameState == "READY") {
		level++;
		//Shortens game time according to level to make it more difficult
		gameTime = 1000 - 100*level;
		if (gameTime < 100)
			gameTime = 100;

		makeDucks();
		gameState = "PLAY";
	}
	else if (gameState == "PLAY") {
		//If screen clicked - make gun shot sound
		shootSound.play();

		var canvas = document.getElementById("game");
		var ctx = canvas.getContext("2d");

		//Flashes red
		ctx.fillStyle = "red";
		ctx.fillRect(0,0,canvas.width, canvas.height);

		//checks if duck was hit - removes it if hit
		checkDuckHit(event);

		//check if all ducks are gone
		if (ducks.length == 0) {
			gameState = "READY";
			//Play next level sound
			nextLevelSound.play();
		}
	}
	else if (gameState == "GAMEOVER") {
		highscore(score);
		//Replay
		level = 0;
		score = 0;
		shots = 3;
		//clear out ducks array
		ducks = [];
		gameState = "READY";

	}

}

//Draws text to the canvas.  Boolean checks if canvas needs to be cleared
function drawText(message,clear) {
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext('2d');

	//clear
	if (clear)
		ctx.clearRect(0,0,canvas.width,canvas.height);

	//Draw needed game message
	ctx.font = "30px serif";
	ctx.fillStyle = "white";
	ctx.fillText(message, canvas.width/2.5, canvas.height/3);

}

//Creates 2 ducks for each level with a randomized position
//Randomizes a target that they will 'fly' to
function makeDucks() {
	for (i=0; i < 2; i++) {
		ducks.push( {posX: Math.random()*700, posY: Math.random()*550, targetX: Math.random()*700, targetY: Math.random()*550} );
	}
}

//Checks if a click was on duck and removes hit duck
function checkDuckHit(event) {
	var x = 0;
	var y = 0;
    var hit = false;
	var canvas = document.getElementById("game");

	//Retrieves coordinates of the click
	x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

	//Makes the click refer to an area within the canvas
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	/*Checks if the click was on a duck.
	xcooridinate checked first and then y coordinate
	if the coordinates mathc, duck is removed from the duck array
	if the click didn't hit a duck, the number of shots the player has
    left is decreased by one
	*/
	for (i=0; i < ducks.length; i++) {
		if (x > ducks[i].posX && x < ducks[i].posX + duckSize) {
			if(y > ducks[i].posY && y < ducks[i].posY + duckSize) {
				//Duck was hit, remove it, increase score
				ducks.splice(i, 1);
				hit = true;
				score += 100;
			}
		}
	}
	if(hit == false){
		shots--;
	}
}

//Main functioning of the game
function updateGameLogic() {
	update_scores();
	if (gameState == "READY") {
		if (level == 0)
			drawText("Click to hunt ducks!",true);
		else {
			drawText("Level " + (level+1).toString() + "!(click screen to start)",true);
		}
	}
	else if (gameState == "PLAY") {
		flapCount++;
		targetChange++;

		//Determines if the targets should be changed
		//Decently high mod value so the ducks don't change targets too quickly
		if (targetChange % 50 == 0)
			updateTargets();

		//move and redraw the canvas for the level
		moveDucks();
		drawDucks();
		drawLives();

		//Acts as the timer for the game to end
		gameTime--;

		if (gameTime == 0 || shots <= 0) {
			gameState = "GAMEOVER";
			ducksFly();
		}
	}
	else if (gameState == "GAMEOVER") {
		//Update count for flap animation
		flapCount++;
		//Move ducks off screen
		moveDucks();
		drawDucks();
		drawText("Game Over! Final Score: " + score + "!" , false);

	}
}

//Draws both ducks for the level
function drawDucks() {
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext('2d');

	//This will make a quacking sound occasionally
	if (Math.random() < .1)
		quack.play();

	ctx.clearRect(0,0,canvas.width,canvas.height);

	//Picks images for each duck depending on where their target is
	//also alternates the position of the wings to simulate flaps
	for (i=0; i < ducks.length; i++) {
		duckImage = new Image();
		if (ducks[i].targetX > ducks[i].posX) {
			if (flapCount % 16 < 8)
				duckImage.src = "images/duckdownright.png";
			else duckImage.src = "images/duckupright.png";
		} else {
			if (flapCount % 16 < 8)
				duckImage.src = "images/duckdownleft.png";
			else duckImage.src = "images/duckupleft.png";
		}

		ctx.drawImage(duckImage,ducks[i].posX,ducks[i].posY,duckSize,duckSize);
	}

}

//Randomly sets new targets
function updateTargets() {
	for (i=0; i < ducks.length; i++) {
		ducks[i].targetX = Math.random() * (700-duckSize);
		ducks[i].targetY = Math.random() * 550;
	}
}

//Sets target for ducks to fly off screen when the player gets a GAMEOVER gameState
function ducksFly() {
	var canvas = document.getElementById("game");

	for (i=0; i < ducks.length; i++) {
		ducks[i].targetX = canvas.width/2;
		ducks[i].targetY = -5*duckSize;
	}
}

//Makes the ducks move toward their target
function moveDucks() {
	for (i=0; i < ducks.length; i++) {
		var differenceX = ducks[i].targetX - ducks[i].posX;
		var differenceY = ducks[i].targetY - ducks[i].posY;

		ducks[i].posX = ducks[i].posX + differenceX/20;
		ducks[i].posY = ducks[i].posY + differenceY/20;
	}
}
