/*global define, console, window,localStorage*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $translate, ConfigService, ColorService, ColorDataService) {

        $scope.selectedLanguage = $translate.use();
        $scope.languageChanged = function (key) {
            ConfigService.setLanguage(key);
            $translate.use(key);
        };

        $scope.selectedDesign = $scope.theme();
        $scope.designChanged = function (key) {
            ConfigService.setDesign(key);
        };

        $scope.reset = function () {
            localStorage.removeItem("ls.design");
            localStorage.removeItem("ls.customColors");
            localStorage.removeItem("ls.favoriteColors");
        };

        $scope.calc = function () {

            //v0=b
            //v1=r
            //v2=g
            var doCalc = function (v0x, v0y, v1x, v1y, v2x, v2y) {

                var orient2d = function (aX, aY, bX, bY, cX, cY) {
                    return (bX - aX) * (cY - aY) - (bY - aY) * (cX - aX);
                };

                var min3 = function (v0x, v1x, v2x) {
                    var retVal = v0x;
                    if (v1x < retVal)
                        retVal = v1x;
                    if (v2x < retVal)
                        retVal = v1x;
                    return retVal;
                };

                var max3 = function (v0x, v1x, v2x) {
                    var retVal = v0x;
                    if (v1x > retVal)
                        retVal = v1x;
                    if (v2x > retVal)
                        retVal = v1x;
                    return retVal;
                };

                var count = 0;
                var tmp = [];
                var renderPixel = function (xy) {
                    count++;
                    var hexColor = "#" + ColorService.CIE1931ToHex("C", xy[0], xy[1], 1);
                    tmp.push(hexColor);
                };

                // Compute triangle bounding box
                var minX = min3(v0x, v1x, v2x);
                var minY = min3(v0y, v1y, v2y);
                var maxX = max3(v0x, v1x, v2x);
                var maxY = max3(v0y, v1y, v2y);

                // Clip against screen bounds
                //minX = max(minX, 0);
                //minY = max(minY, 0);
                //maxX = min(maxX, screenWidth - 1);
                //maxY = min(maxY, screenHeight - 1);

                var px, py;
                var rasterSize = 0.01;
                for (py = minY; py <= maxY; py = py + rasterSize) {
                    for (px = minX; px <= maxX; px = px + rasterSize) {
                        // Determine barycentric coordinates
                        var w0 = orient2d(v1x, v1y, v2x, v2y, px, py);
                        var w1 = orient2d(v2x, v2y, v0x, v0y, px, py);
                        var w2 = orient2d(v0x, v0y, v1x, v1y, px, py);

                        // If p is on or inside all edges, render pixel.
                        if (w0 >= 0 && w1 >= 0 && w2 >= 0)
                            renderPixel([px, py]);
                    }
                }
                return tmp;
                //console.log(tmp);
            };

            var Red = [1.0, 0.0];
            var Green = [0.0, 1.0];
            var Blue = [0.0, 0.0];

            var initGamutA = function () {
                    Red = [0.704, 0.296];
                    Green = [0.2151, 0.7106];
                    Blue = [0.138, 0.08];
                },
                initGamutB = function () {
                    Red = [0.675, 0.322];
                    Green = [0.4091, 0.518];
                    Blue = [0.167, 0.04];
                },
                initGamutC = function () {
                    Red = [0.692, 0.308];
                    Green = [0.17, 0.7];
                    Blue = [0.153, 0.048];
                };

            initGamutB();
            console.log(Blue, Green, Red);
            doCalc(Blue[0], Blue[1], Red[0], Red[1], Green[0], Green[1]);
        };
    }

    ctrl.$inject = ['$scope', '$state', '$translate', 'ConfigService', 'ColorService', 'ColorDataService'];
    return ctrl;

});
