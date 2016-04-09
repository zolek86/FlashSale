module.exports = function() {
    /**
     * point - {lng: float, lat: float}
     */
    return {
        areTwoPointsNotFurtherThatDistance: function(firstPoint, secondPoint, distance) {
            A = {x : firstPoint.lat, y: firstPoint.lat};
            B = {x : secondPoint.lat, y: secondPoint.lat};

            var distanceBetweenAB = sqrt(pow(A.x - B.x) + pow(A.y - B.y));

            return (distanceBetweenAB < distance);
        }
    }
};