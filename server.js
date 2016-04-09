var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log("user connected: "+socket.id);
    socket.on('disconnect', function(){
            console.log("user disconnected: "+socket.id);
        });
});

var locationTest = {postalCode:'59-300',city:"Lubin"};

var location = require('./modules/location')(io);
location.getLocation(locationTest);


http.listen(3000, function(){
    console.log('listening on *:3000');
});