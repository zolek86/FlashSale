var GEO_URL = "maps.googleapis.com"
    , GEO_RESOURCE = "/maps/api/geocode/json?"
    , io
    , socketId
    , http = require('https')
;

module.exports = function(io, socketId) {
    this.io = io;
    this.socketId = socketId;
    return {
        getLocation: function(addressObject) {
            var path =  GEO_RESOURCE + prepareUrlParams(addressObject);
            http.get(
                {
                    host: GEO_URL,
                    path: path
                },
                ioCallback
            ).on('error', function (e) {
                console.log("Got error: " + e.message);
            })
        }
    }
};

function ioCallback(response) {
    var str = '';
    console.log("Got address response code: "+response.statusCode);
    response.resume();
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        try {
            var gis = parseGoogleApiResponse(response);
            console.log('sending GIS event to user: '+ socketId);
            io.sockets.socket(this.socketId).emit('gis',{
                error: true,
                gis: gis
            })
        } catch(e) {
            io.sockets.socket(this.socketId).emit('getAddress',{
                error: true
            })
        }
    });
}

function parseGoogleApiResponse(response) {
    var json = JSON.parse(response);
    if (json.status !== "OK") {
        throw "Dupa, api googlowe nie zwróciło wyników";
    }
    json = json.results[0];
    return {
        lat: json.geometry.location.lat,
        lng: json.geometry.location.lng,
        location: json.formatted_address
    }
}

function prepareUrlParams(addressObject)
{
    var address = "address=";
    for(element in addressObject) {
        if(addressObject.hasOwnProperty(element)) {
            address += "+" + escape(addressObject[element]);
        }
    }
    return address;
}