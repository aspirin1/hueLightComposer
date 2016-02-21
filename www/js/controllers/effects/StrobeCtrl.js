/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, EffectService, UtilityService) {
        console.log("StrobeCtrl");
        $scope.scrambleColors = {
            state: false
        };

        $scope.speedOptions = {
            start: [200],
            connect: 'lower',
            step: 10,
            range: {
                'min': 100,
                'max': 400
            }
        };

        $scope.briOptions = {
            start: [254],
            connect: 'lower',
            step: 1,
            range: {
                'min': 1,
                'max': 254
            }
        };


        $scope.effectName = $filter('translate')('Effect_Strobe');


        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var timing = parseInt($scope.speedOptions.start[0]);
            var bri = parseInt($scope.briOptions.start[0]);
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = key;
                    EffectService.startStrobe(lightId, bri, timing, $scope.scrambleColors.state);
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'EffectService', 'UtilityService'];
    return ctrl;

});
