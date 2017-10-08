var c = document.getElementById('Game')
var ctx = c.getContext('2d')
var target = new Image()

// http://i.imgur.com/ruZv0dl.png sees a CLEAR, CRISP image
target.src = "duck.png"
target.width = 32
target.height = 32

target.onload = function() {
  ctx.drawImage(target, 0, 0, 32, 32);
};
