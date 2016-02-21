/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function ($rootScope, $filter, ColorDataService, DataService, UtilityService) {

        return {
            restrict: 'E',
            scope: {
                lights: "=", //lights to use
                refresh: "@", //refresh light information
                selectedLights: "=", //object for selected lights
                colorSupported: "@", //display color supported
                headerClass: "@", //class added in each tab content
                tabsTop: "@", //css top in pixels for tab bar
                effectsRunning: "@", //display effectsRunning
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
                    $rootScope.$broadcast('GroupSelected', scope.selectedLights.selected);
                };

                getGroupList();
                scope.selectedTab = 1;
                scope.choice = undefined;
                scope.lights = scope.lights || getLightList();
                scope.colorSupported = scope.colorSupported || undefined;
                scope.effectsRunning = scope.effectsRunning || undefined;
                scope.tabsTop = scope.tabsTop || undefined;
                scope.headerClass = scope.headerClass || "";
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
                    if (angular.isDefined(scope.colorSupported)) {
                        var reachable = ColorDataService.isColorReachableByGamut(scope.colorSupported, light.gamut);
                        if (reachable) {
                            return $filter('translate')('LightSelection_LightCanBeDisplayedCorrectly');
                        } else {
                            return $filter('translate')('LightSelection_LightCanNotBeDisplayedCorrectly');
                        }
                    }
                };

                scope.allSelected = function () {
                    angular.forEach(scope.lights, function (light) {
                        scope.selectedLights[light.id] = false;
                    });
                    angular.forEach(scope.lights, function (light) {
                        scope.selectedLights[light.id] = true;
                    });
                    broadcastGroupSelected();
                };

                scope.groupSelected = function (group) {
                    angular.forEach(scope.lights, function (light) {
                        scope.selectedLights[light.id] = false;
                    });
                    angular.forEach(group.lights, function (id) {
                        scope.selectedLights[id] = true;
                    });
                    broadcastGroupSelected();
                    console.log(scope.selectedLights);
                };

                scope.getTabsTop = function () {
                    if (angular.isDefined(scope.tabsTop)) {
                        return {
                            'top': scope.tabsTop + "px"
                        };
                    }
                };

                scope.getEffectRunning = function (lightId) {
                    if (angular.isDefined(scope.effectsRunning)) {
                        return UtilityService.getEffectRunningText(scope.lights, lightId);
                    }
                };
            },
            templateUrl: 'js/directives/lightSelection/lightSelection.html'
        };
    };

    directive.$inject = ['$rootScope', '$filter', 'ColorDataService', 'DataService', 'UtilityService'];
    return directive;
});
