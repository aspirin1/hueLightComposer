/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, HueService, EffectService, LightCommandService, ColorService, $interval, UtilityService) {
        console.log("StandardEffectCtrl", $scope.effect);


        $scope.effectName = $filter('translate')('Effect_' + $scope.effect);

        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(key);
                    if ($scope.effect === "Aurora") {
                        EffectService.startAurora(lightId);
                    }
                    if ($scope.effect === "Candle") {
                        EffectService.startCandle(lightId);
                    }
                }
            });
        };


    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'HueService', 'EffectService', 'LightCommandService', 'ColorService', '$interval', 'UtilityService'];
    return ctrl;

});
