
$(document).ready(function(e){
  var audio = document.createElement('audio');
      audio.setAttribute('src', 'Shotsoundeffect.mp3');
    $("#Game").click(function(e){
        var mousex = e.pagex;
        var mousey = e.pagey;
        audio.play();
    });
});
