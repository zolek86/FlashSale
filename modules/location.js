var GEO_URL = "https://maps.googleapis.com/"
    , GEO_RESOURCE = "maps/api/geocode/json?"
    , io
    , http = require('http')
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
    console.log("Got response: "+resposne.statusCode);
    // consume response body
    res.resume();
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