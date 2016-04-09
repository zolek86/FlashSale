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

    socket.on('sendGis', function(data) {
        var location = new require('./modules/location')(io, socket.id);
        var callbackowane = location.getLocation(data);
        console.log(callbackowane);
        socket.gis = callbackowane;
    });

    socket.on('disconnect', function(){
        console.log("user disconnected: "+socket.id);
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});