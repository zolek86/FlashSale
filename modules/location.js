var sGEO_URL = "maps.googleapis.com"
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
    if (response.statusCode != 200) {
        throw new Error("Http response code: "+response.statusCode);
    }
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
            console.log(e.message);
            tempCallback({
                error: true,
                data: {}
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
        throw new Error("Wrong status: "+ json.status);
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
            address += " " + addressObject[element].trim();
        }
    }
    var route = "address=" + address.split(' ').join('+') + "&language=pl-PL";

    return route;
}