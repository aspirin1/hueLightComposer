/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $translate, DataService, HueService, EffectService, $interval) {
        console.log("CandleCtrl");

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

        $scope.copySelection = {};
        $scope.copyToSelection = function () {

            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(getLightById(key).id);
                    DataService.stopEffect(lightId);

                    HueService.changeLightState(lightId, {
                        on: true,
                        bri: 42,
                        xy: [0.5676, 0.3877],
                    });

                    DataService.setEffect(lightId, "candle", $interval(EffectService.candleEffect, 2000, 0, false, lightId));
                }
            });
        };
    }

    ctrl.$inject = ['$scope', '$state', '$translate', 'DataService', 'HueService', 'EffectService', '$interval'];
    return ctrl;

});
