var GIS_EVENT_NAME = 'gis'
    , GEO_URL = "maps.googleapis.com"
    , GEO_RESOURCE = "/maps/api/geocode/json?"
    , io
    , socketId
    , http = require('https')
    , tempCallback
;

module.exports = function(io, socketId) {
    this.io = io;
    this.socketId = socketId;
    var self = this;
    return {
        getLocation: function(cb, addressObject) {
            tempCallback = cb;
            callback = ioCallback.bind(self);
            var path =  GEO_RESOURCE + prepareUrlParams(addressObject);
            http.get(
                {
                    host: GEO_URL,
                    path: path
                },
                callback
            ).on('error', function (e) {
                console.log("Got error: " + e);
            });
        }
    }
};

function ioCallback(response) {
    var self = this;
    var responseData = '';
    response.resume();
    response.on('data', function (chunk) {
        responseData += chunk;
    });

    callback = function () {
        try {
            var gis = parseGoogleApiResponse(responseData);
            console.log('sending GIS event to user: '+ self.socketId);
            self.io.sockets.connected[self.socketId].gis = gis;
            self.io.sockets.connected[self.socketId].emit(GIS_EVENT_NAME,{
                error: true,
                gis: gis
            });
            tempCallback(gis);
        } catch(e) {
            console.log(e.message);
            self.io.sockets.connected[self.socketId].emit(GIS_EVENT_NAME,{
                error: true
            });
        }
    };

    response.on('end', callback);
}

function parseGoogleApiResponse(response) {
    try {
        var json = JSON.parse(response);
    } catch(e) {
        console.log(e.message);
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
    return address + "&language=pl-PL";
}