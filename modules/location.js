var GEO_URL = "maps.googleapis.com"
    , GEO_RESOURCE = "/maps/api/geocode/json?"
    , io
    , http = require('https')
;

module.exports = function(io) {
    this.io = io;
    return {
        getLocation: function(addressObject) {
            var path =  GEO_RESOURCE + prepareUrlParams(addressObject);
            console.log(path);
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
        console.log(str);
    });
}

function prepareUrlParams(addressObject)
{
    return "address="+addressObject.postalCode+"+"+addressObject.city;
}