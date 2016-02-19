/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function ($rootScope, $filter, ColorDataService, DataService) {


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

                var getGroupList = function () {
                    DataService.getEnrichedGroupInfos().then(function (data) {
                        console.log(data);
                        var tmp = [];
                        var lightGroups = [],
                            rooms = [];
                        angular.forEach(data, function (value, key) {
                            value.id = key;
                            tmp.push(value);
                            if (value.type === "LightGroup")
                                lightGroups.push(value);
                            if (value.type === "Room")
                                rooms.push(value);
                        });

                        scope.allGroups = tmp;
                        scope.lightGroups = lightGroups;
                        scope.rooms = rooms;
                    });
                };

                var broadcastGroupSelected = function () {
                    $rootScope.$broadcast('GroupSelected', scope.selectedLights);
                };

                getGroupList();
                scope.selectedTab = 1;
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

                scope.allSelected = function () {
                    scope.selectedLights = {};
                    angular.forEach(scope.lights, function (light) {
                        scope.selectedLights[light.id] = true;
                    });
                    broadcastGroupSelected();
                };

                scope.groupSelected = function (group) {
                    scope.selectedLights = {};
                    angular.forEach(group.lights, function (id) {
                        scope.selectedLights[id] = true;
                    });
                    broadcastGroupSelected();
                };

            },
            templateUrl: 'js/directives/lightSelection/lightSelection.html'
        };
    };

    directive.$inject = ['$rootScope', '$filter', 'ColorDataService', 'DataService'];
    return directive;
});
