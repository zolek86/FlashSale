module.exports = function() {
    /**
     * point - {lng: float, lat: float}
     */
    return {
        areTwoPointsNotFurtherThatDistance: function(firstPoint, secondPoint, distance) {
            A = {x : firstPoint.lng, y: firstPoint.lat};
            B = {x : secondPoint.lng, y: secondPoint.lat};

            var distanceBetweenAB = sqrt(pow(A.x - B.x) + pow(A.y - B.y));

            return (measure(distanceBetweenAB) < distance);
        }
    };

    function measure(lat1, lon1, lat2, lon2){
        var R = 6378.137; // Radius of earth in KM
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000;
    }
};