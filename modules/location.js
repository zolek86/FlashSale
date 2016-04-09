var GIS_EVENT_NAME = 'gis'
    , GEO_URL = "maps.googleapis.com"
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
                console.log("Got error: " + e);
            })
        }
    }
};

function ioCallback(response) {
    var responseData = '';
    console.log("Got address response code: "+response.statusCode);
    response.resume();
    response.on('data', function (chunk) {
        responseData += chunk;
    });

    response.on('end', function () {
        try {
            var gis = parseGoogleApiResponse(responseData);
            console.log(gis);
            console.log('sending GIS event to user: '+ this.socketId);
            console.log(io);
            // io.sockets.connected[this.socketId].emit(GIS_EVENT_NAME,{
            //     error: true,
            //     gis: gis
            // })
        } catch(e) {
            console.log(e);
            // io.sockets.connected[this.socketId].emit(GIS_EVENT_NAME,{
            //     error: true
            // })
        }
    });
}

function parseGoogleApiResponse(response) {
    try {
        var json = JSON.parse(response);
    } catch(e) {
        console.log(e.message);
        console.log("Bad JSON string to parse from api");
    }

    if (json.status != "OK") {
        throw new Error("jebło w api");
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