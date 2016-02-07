/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, EffectService, UtilityService) {
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
            return UtilityService.getEffectRunningText($scope.allLights, lightId);
        };

        $scope.customLoopTime = 10;
        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var timeInMs = $scope.customLoopTime * 1000;
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(getLightById(key).id);
                    EffectService.startColorLoop(lightId, timeInMs);
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'EffectService', 'UtilityService'];
    return ctrl;

});
