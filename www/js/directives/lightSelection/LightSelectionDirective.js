/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function ($filter, ColorDataService, DataService) {


        return {
            restrict: 'E',
            scope: {
                lights: "=",
                refresh: "@",
                selectedLights: "=",
                colorSupported: "@"
            },
            link: function (scope, element, attrs) {
                var getLightList = function () {
                    var refreshLights = angular.isDefined(scope.refresh);

                    DataService.getEnrichedLightInfos(refreshLights).then(function (data) {
                        var tmp = [];
                        angular.forEach(data, function (value, key) {
                            value.id = key;
                            tmp.push(value);
                        });
                        scope.lights = tmp;
                    });
                };

                scope.lights = scope.lights || getLightList();
                scope.colorSupported = scope.colorSupported || undefined;
                scope.selectedLights = scope.selectedLights || {};

                scope.showColorSupported = function (light) {
                    var showColor = angular.isDefined(scope.colorSupported);
                    if (showColor) {
                        var reachable = ColorDataService.isColorReachableByGamut(scope.colorSupported, light.gamut);
                        if (reachable)
                            return false;
                    }
                    return showColor;
                };

                scope.getColorSupportedText = function (light) {
                    var reachable = ColorDataService.isColorReachableByGamut(scope.colorSupported, light.gamut);
                    if (reachable) {
                        return $filter('translate')('LightSelection_LightCanBeDisplayedCorrectly');
                    } else {
                        return $filter('translate')('LightSelection_LightCanNotBeDisplayedCorrectly');
                    }
                };

            },
            templateUrl: 'js/directives/lightSelection/lightSelection.html'
        };
    };

    directive.$inject = ['$filter', 'ColorDataService', 'DataService'];
    return directive;
});
