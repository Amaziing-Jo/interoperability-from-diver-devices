var KnxConnectionTunneling = require('knx.js').KnxConnectionTunneling;
var connection = new KnxConnectionTunneling('192.168.1.107', 3671, '192.168.1.66', 3671);
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('serve-favicon');
var exec = require('child_process').exec;
var serialport = require('serialport');
var portName = "/dev/ttyACM0";


/*
--------------------------------------------------
Evite l'erreur du crossdomain avec l'application/client web
--------------------------------------------------
 */
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/*
--------------------------------------------------
Serveur Web
--------------------------------------------------
 */
app.use(express.static(__dirname + '/www'));

app.use(favicon(__dirname + '/www/img/logo.png'));

//access to the dashboard
app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/index.html');  
});

/*
--------------------------------------------------
Partie Arduino
--------------------------------------------------
 */
var sp = new serialport.SerialPort(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});

sp.on('data', function(input) {
    console.log(input);
    temp = input;
});

/*
app.get('/arduino/clearlcd', function(req, res){
  sp.write(';');
});

app.get('/arduino/modedraw', function(req, res){
  sp.write('$');
});
*/

app.get('/arduino/:text', function(req, res){
  text = req.params.text;
  sp.write(text);
});

/*
--------------------------------------------------
Partie KNX
--------------------------------------------------
 */
var l1 = false;
var l2 = false;
var l3 = false;
var l4 = false;

function toggleLight(num, etat) {
    connection.Action("0/0/"+num, etat, function(){

    });
}

io.on('connection', function(socket){

    //permet d'écouter le réseau pour les boutons
    connection.on('event', function(adr, info){
        console.log(adr);//adresse de groupe
        console.log(info);//information envoyé par l'adresse de groupe
        //retour d'état de bouton1 (activation chenillar)
        if(adr == "0/2/0"){
            if(info == 1){
                socket.emit('chenille', true);
            } 
        }
        //retour d'état de bouton2 (stop le chenillar)
        //ne marche pas sur la maquette avec l'adresse 107
        else if(adr == "0/2/1"){
            if(info == 1){
                socket.emit('chenille', false);
            }
            
        }
        //retour d'état de bouton3
        else if(adr == "0/2/2"){
            if(info == 1){
                toggleLight(3, true);
                l3 = true;
                socket.emit('light3', true);
            }
            else if(info == 0){
               toggleLight(3, false);
               l3 = false;
               socket.emit('light3', false);
            }
        }
        //retour d'état de bouton4
        else if(adr == "0/2/3"){
            if(info == 1){
                toggleLight(4, true);
                l4 = true;
                socket.emit('light4', true);
            }
            else if(info == 0){
               toggleLight(4, false);
               l4 = false;
               socket.emit('light4', false);
            }
        }
        //retour température
        else if(adr == "0/3/2"){
            socket.emit('temp', info);   
        }
        else if(adr == "0/3/0"){
            socket.emit('CO', info);   
        }
        else if(adr == "0/3/1"){
            var humid = 100 * info / 255;
            socket.emit('humide', humid.substring(0, 3));
        }
        //retour d'état de lampe1
        else if(adr == "0/1/0"){
            socket.emit('retour1', info);
            if(info == 1){
                sp.write(";Lampe 1 allumee");
            }
            else{
                sp.write(";Lampe 1 eteinte");
            }
        }
        //retour d'état de lampe2
        else if(adr == "0/1/1"){
            socket.emit('retour2', info);
            if(info == 1){
                sp.write(";Lampe 2 allumee");
            }
            else{
                sp.write(";Lampe 2 eteinte");
            } 
        }
        //retour d'état de lampe3
        else if(adr == "0/1/2"){
            socket.emit('retour3', info);
            if(info == 1){
                sp.write(";Lampe 3 allumee");
            }
            else{
                sp.write(";Lampe 3 eteinte");
            } 
        }
        //retour d'état de lampe4
        else if(adr == "0/1/3"){
            socket.emit('retour4', info);
            if(info == 1){
                sp.write(";Lampe 4 allumee");
            }
            else{
                sp.write(";Lampe 4 eteinte");
            }  
        }
    });

    
    connection.Connect(function () {
    
        //activation de lampe 1
        socket.on('button1', function(msg){
            if(msg == 'true'){
                console.log("light1 : on");
                toggleLight(1, true);
                l1 = true;
            }
            else if(msg == 'false'){
                console.log("light1 : off");
                toggleLight(1, false);
                l1 = false;
            }
        });
        //activation de lampe 2
        socket.on('button2', function(msg){
             if(msg == 'true'){
                console.log("light2 : on");
                toggleLight(2, true);
            }
            else if(msg == 'false'){
                console.log("light2 : off");
                toggleLight(2, false);
            }
        });
        //activation de lampe 3
        socket.on('button3', function(msg){
             if(msg == 'true'){
                console.log("light3 : on");
                toggleLight(3, true);
            }
            else if(msg == 'false'){
                console.log("light3 : off");
                toggleLight(3, false);
            }
        });
        //activation de lampe 4
        socket.on('button4', function(msg){
             if(msg == 'true'){
                console.log("light4 : on");
                toggleLight(4, true);
            }
            else if(msg == 'false'){
                console.log("light4 : off");
                toggleLight(4, false);
            }
        });

        socket.on('disconnect', function(){
            //connection.Disconnect();
            console.log("Bye bye");
        });

        /*
            Séquence d'initailisation
        */

        socket.on('etatl1', function(){
            connection.RequestStatus("0/1/0", function(id, info){
                if (info == 1){
                    socket.emit('light1', true);
                }
            });
        });
        socket.on('etatl2', function(){
            connection.RequestStatus("0/1/1", function(id, info){
                if (info == 1){
                    socket.emit('light2', true);
                }
            });
        });
        socket.on('etatl3', function(){
            connection.RequestStatus("0/1/2", function(id, info){
                if (info == 1){
                    socket.emit('light3', true);
                }
            });
        });
        socket.on('etatl4', function(){
            connection.RequestStatus("0/1/3", function(id, info){
                if (info ==  1){
                    socket.emit('light4', true);
                }
            });
        });
        socket.on('temperature', function(){
            connection.RequestStatus("0/3/2", function(id, info){
                socket.emit('temp', info);
            });
        });
    });
});

/*
--------------------------------------------------
Partie candle
--------------------------------------------------
 */
//adresse mac bluetooth de la bougie
var adrblth = "AC:E6:4B:07:00:66";
var color = "000000";

//activation commande permettant au serveur de communiquer en bluetooth
var child = exec('gatttool -b '+adrblth+' -I');

//"Vérouille" la connection entre les deux objets
app.get('/candle/connect', function(req, res){
  child.stdin.write('connect\n');
});

//"Dévérouille" la connection entre les deux objets
app.get('/candle/disconnect', function(req, res){
  child.stdin.write('disconnect\n');
});

//permet de faire l'effet bougie
app.get('/candle/modecandleon', function(req, res){
  child.stdin.write('char-write-cmd 0x0014 00'+color+'04000000\n');
});

//active rainbow
app.get('/candle/moderainbow', function(req, res){
  child.stdin.write('char-write-cmd 0x0014 00'+color+'03000000\n');
});

//active le flash avec un intervalle d'une seconde
app.get('/candle/modeflash', function(req, res){
  child.stdin.write('char-write-cmd 0x0014 00'+color+'00006300\n');
});

//désactive les effets
app.get('/candle/effectoff', function(req, res){
  child.stdin.write('char-write-cmd 0x0014 00'+color+'F4000000\n');
});

//Permet d'obtenir la couleur en hexa
app.get('/candle/:color', function(req, res){
  console.log(req.params.color);  
  color = req.params.color;
  child.stdin.write('char-write-cmd 0x0016 00'+req.params.color+'\n');
});
/*
--------------------------------------------------
Port d'écoute du serveur
--------------------------------------------------
 */
http.listen(8080, function(){
  console.log('listening on : 8080');
});

/*
--------------------------------------------------
Arrêt du serveur proprement sans 
bloquer la connection KNX et bluetooth 
pour  les autres utilisateurs
--------------------------------------------------
 */
process.on('SIGINT', function() {
  connection.Disconnect();
  child.stdin.write('disconnect\n');
  console.log("\nBye");
  process.exit(0);
});
