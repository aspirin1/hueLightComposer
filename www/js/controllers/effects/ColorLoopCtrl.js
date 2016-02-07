/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, HueService, EffectService, LightCommandService, ColorService, $interval) {
        console.log("ColorLoopCtrl");

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

        $scope.effectName = $filter('translate')('Effect_ColorLoop');
        $scope.getEffectRunning = function (lightId) {
            if ($scope.allLights.length > 0) {
                var eff = DataService.getEffect(lightId);
                if (angular.isUndefined(eff)) {
                    return $filter('translate')('NO_EFFECT_RUNNING');
                } else {
                    return eff.effect;
                }
            }
        };

        $scope.customLoopTime = 10;
        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var timeInMs = $scope.customLoopTime * 1000;
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(getLightById(key).id);
                    DataService.stopEffect(lightId);

                    HueService.changeLightState(lightId, {
                        on: true,
                    });

                    LightCommandService.farbwechsel(lightId, 5000, timeInMs);
                    DataService.setEffect(lightId,
                        $filter('translate')('Effect_ColorLoop'),
                        $interval(LightCommandService.farbwechsel, timeInMs, 0, false, lightId, 5000, timeInMs));
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'HueService', 'EffectService', 'LightCommandService', 'ColorService', '$interval'];
    return ctrl;

});
