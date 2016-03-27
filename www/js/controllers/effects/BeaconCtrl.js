/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($rootScope, $scope, $filter, DataService, EffectService, UtilityService, ColorService) {
        console.log("BeaconCtrl");

        var unregisterEvent;

        $scope.$on("$ionicView.beforeEnter", function () {
            getLightList();
            unregisterEvent = $rootScope.$on('ColorChanged', function (event, color) {
                console.log(color);
                $scope.selectedColor = ColorService.getGamutXyFromHex("C", color);
            });
        });

        var getLightList = function () {
            DataService.getEnrichedLightInfos(true).then(function (data) {
                var tmp = [];
                angular.forEach(data, function (value, key) {
                    value.id = key;
                    tmp.push(value);
                });
                $scope.lights = tmp;
            });
        };

        var getOrderedSelectedLights = function () {
            var orderedSelectedLightIds = [];
            angular.forEach($scope.lights, function (light) {
                var id = parseInt(light.id);
                if (id in $scope.copySelection && $scope.copySelection[id] === true) {
                    orderedSelectedLightIds.push(parseInt(light.id));
                }
            });
            return orderedSelectedLightIds;
        };

        $scope.$on("$destroy", function () {
            unregisterEvent();
        });

        $scope.sliderOptions = {
            start: [10],
            connect: 'lower',
            step: 1,
            range: {
                'min': 1,
                'max': 30
            }
        };

        $scope.effectName = $filter('translate')('Effect_Beacon');

        $scope.test = {};
        $scope.test.customLoopTime = 10;
        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var orderedSelectedLights = getOrderedSelectedLights();
            var timeInMs = parseInt($scope.sliderOptions.start[0]) * 1000;
            var xyColor = $scope.selectedColor;

            console.log(xyColor);

            EffectService.startBeacon(orderedSelectedLights, timeInMs, xyColor);

        };


    }

    ctrl.$inject = ['$rootScope', '$scope', '$filter', 'DataService', 'EffectService', 'UtilityService', 'ColorService'];
    return ctrl;

});
