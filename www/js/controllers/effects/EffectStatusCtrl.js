/*global define, console, window,angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $filter, ConfigService, DataService) {

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.allLights = tmp;
        });

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

        $scope.selection = {};
        $scope.isLightExecutingEffect = function (lightId) {
            var tmp = DataService.isLightExecutingEffect(lightId);
            if (tmp === true)
                $scope.selection[lightId] = true;
            return tmp;
        };

        $scope.stopAllEffects = function () {
            DataService.getEnrichedLightInfos().then(function (data) {
                angular.forEach(data, function (value, key) {
                    DataService.stopEffect(key);
                });
            });
        };

        $scope.stopEffect = function (lightId) {
            DataService.stopEffect(lightId);
        };
    }

    ctrl.$inject = ['$scope', '$state', '$filter', 'ConfigService', 'DataService'];
    return ctrl;

});
