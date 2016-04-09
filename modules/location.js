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
            console.log(path);
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
            tempCallback({
                error: false,
                data: gis
            });
        } catch(e) {
            tempCallback({
                error: true,
                data: {}
            });
        }
    };

    response.on('end', callback);
}

function parseGoogleApiResponse(response) {
    if (response.statusCode != 200) {
        throw new Error("Kod inny niż 200");
    }
    try {
        var json = JSON.parse(response);
    } catch(e) {
        console.log(e.message);
    }

    if (json.status != "OK") {
        console.log(json.status);
        throw new Error("Status inny niż OK");
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
    var address = "";
    for(element in addressObject) {
        if(addressObject.hasOwnProperty(element) && addressObject[element]!="" && addressObject[element] != undefined) {
            address += " " + addressObject[element];
        }
    }
    var route = "address=" + address.split(' ').join('+') + "&language=pl-PL";
    console.log(route);
    return route;
}