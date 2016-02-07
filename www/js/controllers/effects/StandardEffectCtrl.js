/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, HueService, EffectService, LightCommandService, ColorService, $interval, UtilityService) {
        console.log("StandardEffectCtrl", $scope.effect);

        function getLightById(key) {
            for (var i = 0; i < $scope.allLights.length; i++) {
                if ($scope.allLights[i].id === key) {
                    return $scope.allLights[i];
                }
            }
        }

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

        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(getLightById(key).id);
                    if ($scope.effect === "Aurora") {
                        EffectService.startAurora(lightId);
                    }
                    if ($scope.effect === "Candle") {
                        EffectService.startCandle(lightId);
                    }
                    if ($scope.effect === "Lightning") {
                        EffectService.startLightning(lightId);
                    }
                    if ($scope.effect === "Pulse") {
                        EffectService.startPulse(lightId);
                    }
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'HueService', 'EffectService', 'LightCommandService', 'ColorService', '$interval', 'UtilityService'];
    return ctrl;

});
