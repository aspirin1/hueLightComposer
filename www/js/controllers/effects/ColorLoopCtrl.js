/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $translate, DataService, HueService, EffectService, LightCommandService, ColorService, $interval) {
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
                    DataService.setEffect(lightId, "ColorLoop", $interval(LightCommandService.farbwechsel, timeInMs, 0, false, lightId, 5000, timeInMs));
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$state', '$translate', 'DataService', 'HueService', 'EffectService', 'LightCommandService', 'ColorService', '$interval'];
    return ctrl;

});
