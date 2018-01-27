/*
--------------------------------------------------
Les variables
--------------------------------------------------
 */
var socket;
var chon = 0;
var i = 1;
var loop;
var looperso;
var loopTemp;
var speed = 1000
var sens = false;
var ipserver = "192.168.1.66";

var save = document.cookie;
var ip;
var oldip;
var socket;

// Pour limiter le nombre de run
var nbRun = 0;

/*
==================================================================
Seulement pour l'app avec Cordova (pas pour la version web)
==================================================================
*/

if(save == "" || save == null){
  ip = prompt('The server\'s IP please 🙂');
  if(ip){
    oldip = ip;
  }
  else{
    ip = "192.168.1.66";
    oldip = ip;
  }
  document.cookie = "ip="+ip;
  socket = io.connect('http://'+ip+':8080');
}
else{
  ip = save.substring(3);
  socket = io.connect('http://'+ip+':8080');
}

function change(){
  ip = prompt('Your IP is not : '+ip+'\n The server\'s IP please 🙂');
  if(ip){
    oldip = ip;
  }
  else{
    ip = oldip;
  }
  //document.cookie = "ip="+ip;
  socket = io.connect('http://'+ip+':8080');
}


/*
--------------------------------------------------
Création de la variable qui permet de faire des
requêtes pour la candle
--------------------------------------------------
 */
function getXDomainRequest() {
  var xdr = null;

  if (window.XDomainRequest) {
    xdr = new XDomainRequest();
  } else if (window.XMLHttpRequest) {
    xdr = new XMLHttpRequest();
  } else {
    alert("Votre navigateur ne gère pas l'AJAX cross-domain !");
  }

  return xdr;
}

var xdr = getXDomainRequest();


/*------------------------------------------------------*/

$('#target1').addClass('selected');
$("#direc").prop('checked', true);

/*
--------------------------------------------------
Choix du délai pour le chenillar
--------------------------------------------------
 */
$('button').on('click', function(){
    $('button').removeClass('selected');
    $(this).addClass('selected');
    if($(this).html() == "1s"){
      console.log("1");
      speed = 1000;
      if(chon == 1){
        clearInterval(loop);
        loop = setInterval(chenille, speed);
      }
    }
    else if($(this).html() == "5s"){
      console.log("5");
      speed = 5000;
      if(chon == 1){
        clearInterval(loop);
        loop = setInterval(chenille, speed);
      }
    }
    else if($(this).html() == "10s"){
      console.log("10");
      speed = 10000;
      if(chon == 1){
        clearInterval(loop);
        loop = setInterval(chenille, speed);
      }
    }
});


socket.emit("temperature", 'check');
socket.emit("etatl1", 'check');
socket.emit("etatl2", 'check');
socket.emit("etatl3", 'check');
socket.emit("etatl4", 'check');

$("#etat1").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    socket.emit('button1', 'true');
    $("#img-item1").removeClass("img-check").addClass("check");
    console.log("true");
  } else {
    $(this).attr('value', 'false');
    socket.emit('button1', 'false');
    $("#img-item1").removeClass("check").addClass("img-check");
    console.log("false");
  }
});

$("#etat2").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    socket.emit('button2', 'true');
    $("#img-item2").removeClass("img-check").addClass("check");
    console.log("true");
  } else {
    $(this).attr('value', 'false');
    socket.emit('button2', 'false');
    $("#img-item2").removeClass("check").addClass("img-check");
    console.log("false");
  }
});

$("#etat3").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    socket.emit('button3', 'true');
    $("#img-item3").removeClass("img-check").addClass("check");
    console.log("true");
  } else {
    $(this).attr('value', 'false');
    socket.emit('button3', 'false');
    $("#img-item3").removeClass("check").addClass("img-check");
    console.log("false");
  }
});

$("#etat4").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    socket.emit('button4', 'true');
    $("#img-item4").removeClass("img-check").addClass("check");
    console.log("true");
  } else {
    $(this).attr('value', 'false');
    socket.emit('button4', 'false');
    $("#img-item4").removeClass("check").addClass("img-check");
    console.log("false");
  }
});

$("#ch").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    chon = 1;
    Stop();
    //  start boucle
    loop = setInterval(chenille, speed);
    console.log("chon" + chon);
  } else {
    $(this).attr('value', 'false');
    //arrêt de la boucle
    clearInterval(loop);
    chon = 0;
    console.log("chon" + chon);
  }
});

$("#direc").on('change', function() {
  if ($(this).is(':checked')) {
    sens = false;
    $(this).attr('value', 'true');
  }
  else {
    $(this).attr('value', 'false');
    sens = true;
    i = 4;
  }
});

function refreshTemp(){
 socket.emit('temperature')
}

/*
--------------------------------------------------
Retour d'information de la maquette
--------------------------------------------------
 */
loopTemp = setInterval(refreshTemp, 300000);

socket.on('temp', function(msg){
  $('#lvltemp').replaceWith('<p id="lvltemp">'+msg+' °C</p>');
});

socket.on('CO', function(msg){
  $('#lvlCO').replaceWith('<p id="lvlCO">'+msg+' ppm</p>');
})

socket.on('humide', function(msg){
  $('#lvlhumid').replaceWith('<p id="lvlhumid">'+msg+' %</p>');
})

socket.on('retour1', function(msg){
  if(msg == 1){
  	$("#etat1").prop('checked', true);
    $("#img-item1").removeClass("img-check").addClass("check");
  }
  else if(msg == 0){
    $("#etat1").prop('checked', false);
    $("#img-item1").removeClass("check").addClass("img-check");
  }
});

socket.on('retour2', function(msg){
  if(msg == 1){
    $("#etat2").prop('checked', true);
    $("#img-item2").removeClass("img-check").addClass("check");
  }
  else if(msg == 0){
    $("#etat2").prop('checked', false);
    $("#img-item2").removeClass("check").addClass("img-check");
  }
});

socket.on('retour3', function(msg){
  if(msg == 1){
    $("#etat3").prop('checked', true);
    $("#img-item3").removeClass("img-check").addClass("check");
  }
  else if(msg == 0){
    $("#etat3").prop('checked', false);
    $("#img-item3").removeClass("check").addClass("img-check");
  }
});

socket.on('retour4', function(msg){
  if(msg == 1){
    $("#etat4").prop('checked', true);
    $("#img-item4").removeClass("img-check").addClass("check");
  }
  else if(msg == 0){
    $("#etat4").prop('checked', false);
    $("#img-item4").removeClass("check").addClass("img-check");
  }
});

socket.on('chenille', function(msg){
  if(msg == true && chon == 0){
    chenille();
    loop = setInterval(chenille, speed);
    $("#ch").prop('checked', true);
    chon = 1;
  }
  else if (msg == false){
    clearInterval(loop);
    $("#etat2").prop('checked', false);
    chon = 0;
  }
});

/*
--------------------------------------------------
Le chenillar
--------------------------------------------------
 */
function chenille(){
  switch(i){
    case 1:
      socket.emit('button1', 'true');
      socket.emit('button2', 'false');
      socket.emit('button3', 'false');
      socket.emit('button4', 'false');
      /*
      $("#etat1").prop('checked', true);
      $("#etat2").prop('checked', false);
      $("#etat3").prop('checked', false);
      $("#etat4").prop('checked', false);
      $("#img-item1").removeClass("img-check").addClass("check");
      $("#img-item2").removeClass("check").addClass("img-check");
      $("#img-item3").removeClass("check").addClass("img-check");
      $("#img-item4").removeClass("check").addClass("img-check");
      */

        console.log("1");
        break;
    case 2:
      socket.emit('button2', 'true');
      socket.emit('button1', 'false');
      socket.emit('button3', 'false');
      socket.emit('button4', 'false');
      /*
      $("#etat2").prop('checked', true);
      $("#etat1").prop('checked', false);
      $("#etat3").prop('checked', false);
      $("#etat4").prop('checked', false);
      $("#img-item1").removeClass("check").addClass("img-check");
      $("#img-item2").removeClass("img-check").addClass("check");
      $("#img-item3").removeClass("check").addClass("img-check");
      $("#img-item4").removeClass("check").addClass("img-check");
      */

        console.log("2");
        break;
    case 3:
      socket.emit('button3', 'true');
      socket.emit('button2', 'false');
      socket.emit('button1', 'false');
      socket.emit('button4', 'false');
      /*
      $("#etat3").prop('checked', true);
      $("#etat2").prop('checked', false);
      $("#etat1").prop('checked', false);
      $("#etat4").prop('checked', false);
      $("#img-item1").removeClass("check").addClass("img-check");
      $("#img-item2").removeClass("check").addClass("img-check");
      $("#img-item3").removeClass("img-check").addClass("check");
      $("#img-item4").removeClass("check").addClass("img-check");
      */

        console.log("3");
        break;
    case 4:
      socket.emit('button4', 'true');
      socket.emit('button2', 'false');
      socket.emit('button3', 'false');
      socket.emit('button1', 'false');
      /*
      $("#etat4").prop('checked', true);
      $("#etat2").prop('checked', false);
      $("#etat3").prop('checked', false);
      $("#etat1").prop('checked', false);
      $("#img-item1").removeClass("check").addClass("img-check");
      $("#img-item2").removeClass("check").addClass("img-check");
      $("#img-item3").removeClass("check").addClass("img-check");
      $("#img-item4").removeClass("img-check").addClass("check");
      */

        console.log("4");
        break;
  }
  if(!sens){
    i++;
    if(i == 5){
        i = 1;
    }
  }
  else if (sens){
    i--;
    if(i == 0){
      i = 4;
    }
  }
}

/*
--------------------------------------------------
Chenillar personnalisé
--------------------------------------------------
 */
var sequence = new Array();


for (var j = 0; j < 4; j++) {
  sequence[j] = new Array();
}

function SaveChenillard(){
  sequence[0][0] = $('#S11').is(':checked');
  sequence[0][1] = $('#S12').is(':checked');
  sequence[0][2] = $('#S13').is(':checked');
  sequence[0][3] = $('#S14').is(':checked');
  sequence[0][4] = $('#S15').val();
  sequence[1][0] = $('#S21').is(':checked');
  sequence[1][1] = $('#S22').is(':checked');
  sequence[1][2] = $('#S23').is(':checked');
  sequence[1][3] = $('#S24').is(':checked');
  sequence[1][4] = $('#S25').val();
  sequence[2][0] = $('#S31').is(':checked');
  sequence[2][1] = $('#S32').is(':checked');
  sequence[2][2] = $('#S33').is(':checked');
  sequence[2][3] = $('#S34').is(':checked');
  sequence[2][4] = $('#S35').val();
  sequence[3][0] = $('#S41').is(':checked');
  sequence[3][1] = $('#S42').is(':checked');
  sequence[3][2] = $('#S43').is(':checked');
  sequence[3][3] = $('#S44').is(':checked');
  sequence[3][4] = $('#S45').val();
}

function Run() {
  if(nbRun == 0){
    var temptotal = parseInt(sequence[0][4])*1000 + parseInt(sequence[1][4])*1000 + parseInt(sequence[2][4])*1000 + parseInt(sequence[3][4])*1000;
    clearInterval(loop);
    $("#ch").prop('checked', false);
    On();
    looperso = setInterval(On, temptotal);
    nbRun++
  }
}
var timer1;
var timer2;
var timer3;
function On(){
               for (var k = 0; k < (sequence[0].length - 1); k++) {
                number = k + 1;
                socket.emit('button'+number, sequence[0][k].toString());
                console.log(sequence[0][k].toString());
               }
               /*$("#etat1").prop('checked', sequence[0][0]);
               if(sequence[0][0]){$("#img-item1").removeClass("img-check").addClass("check");}
               else {$("#img-item1").removeClass("check").addClass("img-check");}
               $("#etat2").prop('checked', sequence[0][1]);
               if(sequence[0][1]){$("#img-item2").removeClass("img-check").addClass("check");}
               else {$("#img-item2").removeClass("check").addClass("img-check");}
               $("#etat3").prop('checked', sequence[0][2]);
               if(sequence[0][2]){$("#img-item3").removeClass("img-check").addClass("check");}
               else {$("#img-item3").removeClass("check").addClass("img-check");}
               $("#etat4").prop('checked', sequence[0][3]);
               if(sequence[0][3]){$("#img-item4").removeClass("img-check").addClass("check");}
               else {$("#img-item4").removeClass("check").addClass("img-check");}*/

    timer1 = setTimeout(function(){
               for (var k = 0; k < (sequence[1].length - 1); k++) {
                number = k + 1;
                socket.emit('button'+number, sequence[1][k].toString());
                console.log(sequence[1][k].toString());
               }
               /*$("#etat1").prop('checked', sequence[1][0]);
               if(sequence[1][0]){$("#img-item1").removeClass("img-check").addClass("check");}
               else {$("#img-item1").removeClass("check").addClass("img-check");}
               $("#etat2").prop('checked', sequence[1][1]);
               if(sequence[1][1]){$("#img-item2").removeClass("img-check").addClass("check");}
               else {$("#img-item2").removeClass("check").addClass("img-check");}
               $("#etat3").prop('checked', sequence[1][2]);
               if(sequence[1][2]){$("#img-item3").removeClass("img-check").addClass("check");}
               else {$("#img-item3").removeClass("check").addClass("img-check");}
               $("#etat4").prop('checked', sequence[1][3]);
               if(sequence[1][3]){$("#img-item4").removeClass("img-check").addClass("check");}
               else {$("#img-item4").removeClass("check").addClass("img-check");}*/
               }, parseInt(sequence[0][4])*1000);
    timer2 = setTimeout(function(){
               for (var k = 0; k < (sequence[2].length - 1); k++) {
                number = k + 1;
                socket.emit('button'+number, sequence[2][k].toString());
                console.log(sequence[2][k].toString());
               }
               /*$("#etat1").prop('checked', sequence[2][0]);
               if(sequence[2][0]){$("#img-item1").removeClass("img-check").addClass("check");}
               else {$("#img-item1").removeClass("check").addClass("img-check");}
               $("#etat2").prop('checked', sequence[2][1]);
               if(sequence[2][1]){$("#img-item2").removeClass("img-check").addClass("check");}
               else {$("#img-item2").removeClass("check").addClass("img-check");}
               $("#etat3").prop('checked', sequence[2][2]);
               if(sequence[2][2]){$("#img-item3").removeClass("img-check").addClass("check");}
               else {$("#img-item3").removeClass("check").addClass("img-check");}
               $("#etat4").prop('checked', sequence[2][3]);
               if(sequence[2][3]){$("#img-item4").removeClass("img-check").addClass("check");}
               else {$("#img-item4").removeClass("check").addClass("img-check");}*/
               }, parseInt(sequence[0][4])*1000 + parseInt(sequence[1][4])*1000);
    timer3 = setTimeout(function(){
               for (var k = 0; k < (sequence[3].length - 1); k++) {
                number = k + 1;
                socket.emit('button'+number, sequence[3][k].toString());
                console.log(sequence[3][k].toString());
               }
               /*
               $("#etat1").prop('checked', sequence[3][0]);
               if(sequence[3][0]){$("#img-item1").removeClass("img-check").addClass("check");}
               else {$("#img-item1").removeClass("check").addClass("img-check");}
               $("#etat2").prop('checked', sequence[3][1]);
               if(sequence[3][1]){$("#img-item2").removeClass("img-check").addClass("check");}
               else {$("#img-item2").removeClass("check").addClass("img-check");}
               $("#etat3").prop('checked', sequence[3][2]);
               if(sequence[3][2]){$("#img-item3").removeClass("img-check").addClass("check");}
               else {$("#img-item3").removeClass("check").addClass("img-check");}
               $("#etat4").prop('checked', sequence[3][3]);
               if(sequence[3][3]){$("#img-item4").removeClass("img-check").addClass("check");}
               else {$("#img-item4").removeClass("check").addClass("img-check");}
               */
               }, parseInt(sequence[0][4])*1000 + parseInt(sequence[1][4])*1000 + parseInt(sequence[2][4])*1000);
}

function Stop() {
  nbRun = 0;
  clearTimeout(timer1);
  clearTimeout(timer2);
  clearTimeout(timer3);
  clearInterval(looperso);
}


/*
--------------------------------------------------
Partie Bougie
--------------------------------------------------
 */
mcandle = false;
mrainbow = false;
mflash = false;

function update(jscolor) {
    document.getElementById('rect').style.backgroundColor = '#' + jscolor;
    var r = jscolor.styleElement.style.backgroundColor.substring(4, jscolor.styleElement.style.backgroundColor.indexOf(","));
    var red = Number(r);
    var redhexa = red.toString(16).toUpperCase();
    if (redhexa.length == 1){
      redhexa = "0"+redhexa;
    }
    var g = jscolor.styleElement.style.backgroundColor.substring(jscolor.styleElement.style.backgroundColor.indexOf(",")+2, jscolor.styleElement.style.backgroundColor. lastIndexOf(","));
    var green = Number(g);
    var greenhexa = green.toString(16).toUpperCase();
    if (greenhexa.length == 1){
      greenhexa = "0"+greenhexa;
    }
    var b = jscolor.styleElement.style.backgroundColor.substring(jscolor.styleElement.style.backgroundColor.lastIndexOf(",")+2, jscolor.styleElement.style.backgroundColor.indexOf(")"));
    var blue = Number(b);
    var bluehexa = blue.toString(16).toUpperCase();
    if (bluehexa.length == 1){
      bluehexa = "0"+bluehexa;
    }
    var color = redhexa + greenhexa + bluehexa;
    console.log(color);
  xdr.open("GET", "http://"+ipserver+":8080/candle/"+color, true);
  xdr.send();
}

$("#couleur").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    xdr.open("GET", "http://"+ipserver+":8080/candle/moderainbow", true);
  mrainbow = !mrainbow;
  console.log("rainbow mode");
  }
  else {
    $(this).attr('value', 'false');
    xdr.open("GET", "http://"+ipserver+":8080/candle/effectoff", true);
  mrainbow = !mrainbow;
  console.log("stop rainbow");
  }
  if(mcandle){
    mcandle = !mcandle;
    $("#bougie").prop('checked', false);
  }
  if(mflash){
    mflash = ! mflash;
    $("#radar").prop('checked', false);
  }
  xdr.send();
});

$("#bougie").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    xdr.open("GET", "http://"+ipserver+":8080/candle/modecandleon", true);
  mcandle = !mcandle;
  console.log("candle on");
  }
  else {
    $(this).attr('value', 'false');
    xdr.open("GET", "http://"+ipserver+":8080/candle/effectoff", true);
  mcandle = !mcandle;
  console.log("candle off");
  }
  if(mrainbow){
    mrainbow = !mrainbow;
    $("#couleur").prop('checked', false);
  }
  if(mflash){
    mflash = ! mflash;
    $("#radar").prop('checked', false);
  }
  xdr.send();
});

$("#radar").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    xdr.open("GET", "http://"+ipserver+":8080/candle/modeflash", true);
  mflash = !mflash;
  console.log("flash mode");
  } else {
    $(this).attr('value', 'false');
    xdr.open("GET", "http://"+ipserver+":8080/candle/effectoff", true);
  mflash = !mflash;
  console.log("stop flash");
  }
  if(mcandle){
    mcandle = !mcandle;
    $("#bougie").prop('checked', false);
  }
  if(mrainbow){
    mrainbow = ! mrainbow;
    $("#couleur").prop('checked', false);
  }
  xdr.send();
});


$("#choix2").on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    xdr.open("GET", "http://"+ipserver+":8080/candle/connect", true);
  } else {
    $(this).attr('value', 'false');
    xdr.open("GET", "http://"+ipserver+":8080/candle/disconnect", true);
  }
  xdr.send();
});

/*
--------------------------------------------------
Martice 8x8
--------------------------------------------------
 */
var hexa8;
 var hexa;
 var msg = "$";
 var valhexa = 0;

function SendDraw(){
  for(hexa8 = 0; hexa8 < 8; hexa8++){
    for(hexa = 1; hexa < 9; hexa++){
      if(hexa == 5){
        msg = msg + valhexa.toString(16);
        valhexa = 0;
      }

      if($('#S1'+hexa8+hexa).is(':checked')){
        switch (hexa) {
          case 1:
            valhexa = valhexa + 8;
            break;
          case 2:
            valhexa = valhexa + 4;
            break;
          case 3:
            valhexa = valhexa + 2;
            break;
          case 4:
            valhexa = valhexa + 1;
            break;
          case 5:
            valhexa = valhexa + 8;
            break;  
          case 6:
            valhexa = valhexa + 4;
            break;
          case 7:
            valhexa = valhexa + 2;
            break;
          case 8:
            valhexa = valhexa + 1;
            break;
        }
      }

      if(hexa == 8){
        msg = msg + valhexa.toString(16);
        valhexa = 0;
        if(hexa8 == 7){
          console.log(msg);
          xdr.open("GET", "http://"+ipserver+":8080/arduino/"+msg);
          xdr.send();
        }
      }

    }
  }
}

function ClearDraw(){
  for(hexa8 = 0; hexa8 < 8; hexa8++){
    for(hexa = 1; hexa < 9; hexa++){
      $('#S1'+hexa8+hexa).prop('checked', false);
    }
  }
}