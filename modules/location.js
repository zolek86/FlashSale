var GEO_URL = "maps.googleapis.com"
    , GEO_RESOURCE = "/maps/api/geocode/json?"
    , io
    , http = require('https')
;

module.exports = function(io) {
    this.io = io;
    return {
        getLocation: function(addressObject) {
            var params = prepareUrlParams(addressObject);
            http.get(
                {
                    host: GEO_URL,
                    path: GEO_RESOURCE + params
                },
                ioCallback
            ).on('error', function (e) {
                console.log("Got error: " + e.message);
            })
        }
    }
};

function ioCallback(response) {
    console.log("Got response: "+response.statusCode);
    // consume response body
    response.resume();
    // var str = '';
    // response.on('data', function (chunk) {
    //     str += chunk;
    // });
    //
    // response.on('end', function () {
    //     console.log(str);
    // });
}

function prepareUrlParams(addressObject)
{
    return JSON.stringify({
        address : escape(addressObject.postalCode)+"+"+escape(addressObject.city)
    });
}