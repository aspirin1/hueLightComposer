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

        $scope.sliderOptions = {
            start: [10],
            connect: 'lower',
            step: 1,
            range: {
                'min': 1,
                'max': 30
            }
        };

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.allLights = tmp;
        });
        $scope.anythingSelected = function () {
            var retVal = false;
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true)
                    retVal = true;
            });
            return retVal;
        };

        $scope.effectName = $filter('translate')('Effect_ColorLoop');
        $scope.getEffectRunning = function (lightId) {
            return UtilityService.getEffectRunningText($scope.allLights, lightId);
        };

        $scope.test = {};
        $scope.test.customLoopTime = 10;
        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var timeInMs = parseInt($scope.sliderOptions.start[0]) * 1000;
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
