/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, EffectService, UtilityService, ColorService) {


        $scope.effectName = $filter('translate')('Effect_PulseColorTransition');

        $scope.picker1 = {
            colors: [{
                color: "#ffffff"
            }]
        };
        $scope.picker2 = {
            colors: [{
                color: "#ffffff"
            }]
        };

        $scope.speedOptions = {
            start: [10],
            connect: 'lower',
            step: 1,
            range: {
                'min': 1,
                'max': 30
            }
        };

        $scope.briOptions = {
            start: [40, 254],
            connect: true,
            step: 1,
            range: {
                'min': 1,
                'max': 254
            }
        };

        $scope.test = {};
        $scope.test.maxTimeBetween = 10;
        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var timeInMs = parseInt($scope.speedOptions.start[0]) * 1000;
            var minBri = parseInt($scope.briOptions.start[0]);
            var maxBri = parseInt($scope.briOptions.start[1]);
            var color1 = $scope.picker1.colors[0].color;
            var color2 = $scope.picker2.colors[0].color;

            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var light = DataService.getLightById(key);
                    var lightId = light.id;
                    var color1xy;
                    var color2xy;
                    if (color1 != "#000000") {
                        color1xy = ColorService.getGamutXyFromHex(light.gamut, color1);
                    }
                    if (color2 != "#000000") {
                        color2xy = ColorService.getGamutXyFromHex(light.gamut, color2);
                    }

                    EffectService.startPulsierenMitFarbwechsel1(lightId, timeInMs, minBri, maxBri, color1xy, color2xy);
                }
            });
        };

    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'EffectService', 'UtilityService', 'ColorService'];
    return ctrl;

});