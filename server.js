var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var location, offers = []
    ,areaIntersect = require('./modules/areaIntersect')
    ,MAX_DISTANCE_IN_METERS = 3000
    ,fileUpload
;

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

    socket.on('addOffer',function(data) {
        offers.append({
            id : socket.id,
            gis: socket.gis,
            name: data.name,
            category: data.category,
            photoUrl: fileUpload.upload(data)
        });
    });

    socket.on('getOffers',function(data) {
        var category = data.category;
        var response = {
            error : true,
            data: []
        };

        if (socket.gis == undefined) {
            socket.emit('getOffers',response);
        }

        offers.forEach(function(offer){
            if (offer.category != category) {return};

            if(areaIntersect.areTwoPointsNotFurtherThatDistance(offer.gis, socket.gis, MAX_DISTANCE_IN_METERS)) {
                response.data.append({
                    name: offer.name,
                    photoUrl: offer.photoUrl
                })
            }
        });

        socket.emit('getOffers',response);
    });

    socket.on('disconnect', function(){
        // offers.forEach(function(offer){
        //todo  UNSET OFFERS
        // };
        console.log("user disconnected: "+socket.id);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});