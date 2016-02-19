/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, EffectService, UtilityService) {
        console.log("LightningCtrl");
        $scope.scrambleColors = {
            state: false
        };
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
        $scope.effectName = $filter('translate')('Effect_Lightning');
        $scope.getEffectRunning = function (lightId) {
            return UtilityService.getEffectRunningText($scope.allLights, lightId);
        };

        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            console.log($scope.scrambleColors.state)
            var timeInMs = parseInt($scope.sliderOptions.start[0]) * 1000;
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(UtilityService.getLightById($scope.allLights, key).id);
                    EffectService.startLightning(lightId, timeInMs, $scope.scrambleColors.state);
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'EffectService', 'UtilityService'];
    return ctrl;

});
