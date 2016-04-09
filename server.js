var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/app/index.html');
});

io.on('connection', function(socket){
    console.log("user connected: "+socket.id);
    socket.on('disconnect', function(){
        console.log("user disconnected: "+socket.id);
    });
    
    var locationTest = {postalCode:'59-300',city:"Lubin"};
    var location = require('./modules/location')(io, socket.id);
    location.getLocation(locationTest);
});



http.listen(3000, function(){
    console.log('listening on *:3000');
});