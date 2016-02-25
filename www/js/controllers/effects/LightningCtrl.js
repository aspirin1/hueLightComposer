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

        $scope.effectName = $filter('translate')('Effect_Lightning');


        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var timeInMs = parseInt($scope.sliderOptions.start[0]) * 1000;
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(key);
                    EffectService.startLightning(lightId, timeInMs, $scope.scrambleColors.state);
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'EffectService', 'UtilityService'];
    return ctrl;

});
