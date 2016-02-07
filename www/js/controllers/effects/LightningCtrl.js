/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, EffectService, UtilityService) {
        console.log("LightningCtrl");



        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.allLights = tmp;
        });

        $scope.effectName = $filter('translate')('Effect_Lightning');
        $scope.getEffectRunning = function (lightId) {
            return UtilityService.getEffectRunningText($scope.allLights, lightId);
        };

        $scope.test = {};
        $scope.test.maxTimeBetween = 10;
        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var timeInMs = $scope.test.maxTimeBetween * 1000;
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(UtilityService.getLightById($scope.allLights, key).id);
                    EffectService.startLightning(lightId, timeInMs);
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'EffectService', 'UtilityService'];
    return ctrl;

});
