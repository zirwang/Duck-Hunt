
$(document).ready(function(e){
  var canvas = document.getElementById('Game');
  var ctx = canvas.getContext('2d');
  var audio = document.createElement('audio');
  canvas.width = 700;
  canvas.height= 500;
      audio.setAttribute('src', 'Shotsoundeffect.mp3');
    $("#Game").click(function(e){
        var mousex = e.pagex;
        var mousey = e.pagey;
        audio.play();
    });
// DRAW LIVES
    var life1 = new Image();
    var life2 = new Image();
    var life3 = new Image();
    life1.onload = function() {
     ctx.imageSmoothingEnabled = false;
     ctx.drawImage(this, 0, 450, 40,30);
   };
   life2.onload = function() {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this, 40, 450, 40,30);
  };
  life3.onload = function() {
   ctx.imageSmoothingEnabled = false;
   ctx.drawImage(this, 80, 450, 40,30);
 };
   life1.src = "heart.png"
   life2.src = "heart.png"
   life3.src = "heart.png"
//DRAW DUCK
var duck = new Image();
duck.onload = function() {
 ctx.imageSmoothingEnabled = false;
 ctx.drawImage(this, 20, 20, 60,60);
};
duck.src = "duck.png"
});
