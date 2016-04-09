var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var location;

app.use(express.static(__dirname + '/dev'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/dev/index.html');
});

io.on('connection', function(socket){
    console.log("user connected: "+socket.id);

    socket.on('sendGis', function(data) {
        location = new require('./modules/location')(io, socket.id);
        callback = function(response) {
            socket.emit('gis',{
                error: response.error,
                gis: response.data
            });
            if (!response.error) {
                socket.gis = response.gis;
            }
        };
        location.getLocation(callback, data);
    });

    socket.on('disconnect', function(){
        console.log("user disconnected: "+socket.id);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});