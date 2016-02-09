/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, EffectService, UtilityService) {
        console.log("PulseCtrl");

        if ($scope.effect === "Pulse") {
            $scope.showColors = false;
        } else {
            $scope.showColors = true;
        }

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

        $scope.optionsColumn1 = {
            size: 30,
            columns: 4,
            roundCorners: true,
            customColors: ["#7bd148", "#5484ed", "#a4bdfc", "#46d6db", "#7ae7bf", "#51b749", "#fbd75b", "#ffb878"]
        };

        $scope.optionsColumn2 = {
            size: 30,
            columns: 4,
            roundCorners: true,
            customColors: ['#fbd75b', '#ffb878', '#ff887c', '#dc2127', '#dbadff', '#e1e1e1', "#fbd75c", "#ffbe78"]
        };


        $scope.colors1 = {};

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.allLights = tmp;
        });

        $scope.effectName = $filter('translate')('Effect_' + $scope.effect);
        $scope.getEffectRunning = function (lightId) {
            return UtilityService.getEffectRunningText($scope.allLights, lightId);
        };

        $scope.test = {};
        $scope.test.maxTimeBetween = 10;
        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var timeInMs = parseInt($scope.speedOptions.start[0]) * 1000;
            var minBri = parseInt($scope.briOptions.start[0]);
            var maxBri = parseInt($scope.briOptions.start[1]);
            var color1 = $scope.selectedColor1;
            var color2 = $scope.selectedColor2;

            console.log(color1, color2);
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(UtilityService.getLightById($scope.allLights, key).id);
                    if ($scope.effect === "Pulse") {
                        EffectService.startPulse(lightId, timeInMs, minBri, maxBri);
                    } else if ($scope.effect === "PulseColorTransition") {
                        EffectService.startPulsierenMitFarbwechsel1(lightId, timeInMs, minBri, maxBri);
                    } else if ($scope.effect === "PulseChangingColors") {
                        EffectService.startPulsierenMitFarbwechsel2(lightId, timeInMs, minBri, maxBri);
                    }

                }
            });
        };
        $scope.copyToSelection2 = function () {
            var timeInMs = parseInt($scope.speedOptions.start[0]) * 1000;
            var minBri = parseInt($scope.briOptions.start[0]);
            var maxBri = parseInt($scope.briOptions.start[1]);
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(UtilityService.getLightById($scope.allLights, key).id);
                    EffectService.startPulsierenMitFarbwechsel2(lightId, timeInMs, minBri, maxBri);
                }
            });
        };

    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'EffectService', 'UtilityService'];
    return ctrl;

});
