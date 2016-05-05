/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($rootScope, $scope, $filter, DataService, EffectService, UtilityService, ColorService, ColorDataService) {

        $scope.$on("$ionicView.beforeEnter", function () {
            getLightList();

        });

        $scope.picker1 = {
            colors: []
        };

        $scope.lightSelectionChanged = function () {
            var pickerElementCount = $scope.picker1.colors.length;
            var selectedLightsCount = 0;

            angular.forEach($scope.lights, function (light) {
                var id = parseInt(light.id);
                if (id in $scope.copySelection && $scope.copySelection[id] === true) {
                    selectedLightsCount++;
                }
            });

            if (pickerElementCount < selectedLightsCount) {
                var elementsToAdd = selectedLightsCount - pickerElementCount;
                for (var i = 0; i < elementsToAdd; i++) {
                    $scope.picker1.colors.push({
                        color: '#ffffff'
                    });
                }
            } else if (pickerElementCount > selectedLightsCount) {
                var elementsToRemove = pickerElementCount - selectedLightsCount;
                for (var j = 0; j < elementsToRemove; j++) {
                    $scope.picker1.colors.pop();
                }
            }
        };

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

        });

        $scope.sliderOptions = {
            start: [5],
            connect: 'lower',
            step: 0.5,
            range: {
                'min': 0.5,
                'max': 10
            }
        };

        $scope.effectName = $filter('translate')('Effect_Carousel');

        $scope.test = {};
        $scope.test.customLoopTime = 10;
        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var orderedSelectedLights = getOrderedSelectedLights();
            var timeInMs = parseInt($scope.sliderOptions.start[0] * 1000);

            var xyColors = [];
            angular.forEach($scope.picker1.colors, function (color) {
                //var hexColor = ColorDataService.getRandomHexColorForGamutC();
                var xy = ColorService.getGamutXyFromHex("C", color.color);
                xyColors.push(xy);
            });


            EffectService.startCarousel(orderedSelectedLights, timeInMs, xyColors);

        };


    }

    ctrl.$inject = ['$rootScope', '$scope', '$filter', 'DataService', 'EffectService', 'UtilityService', 'ColorService', 'ColorDataService'];
    return ctrl;

});