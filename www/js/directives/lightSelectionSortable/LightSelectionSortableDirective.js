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
                effectsRunning: "@", //display effectsRunning,
                changed: "=" //changed event
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
                    DataService.getEnrichedGroupInfos(false).then(function (data) {

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
                scope.lights = scope.lights || getLightList();
                scope.colorSupported = scope.colorSupported || undefined;
                scope.effectsRunning = scope.effectsRunning || undefined;
                scope.tabsTop = scope.tabsTop || undefined;
                scope.headerClass = scope.headerClass || "";
                scope.selectedLights = scope.selectedLights || {};
                scope.changed = scope.changed || function () {};

                scope.selectionChanged = function () {
                    scope.changed();
                };

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
                    scope.selectionChanged();
                };

                scope.groupSelected = function (group) {
                    angular.forEach(scope.lights, function (light) {
                        scope.selectedLights[light.id] = false;
                    });
                    angular.forEach(group.lights, function (id) {
                        scope.selectedLights[id] = true;
                    });
                    broadcastGroupSelected();
                    scope.selectionChanged();
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

                scope.moveItem = function (item, fromIndex, toIndex) {
                    scope.lights.splice(fromIndex, 1);
                    scope.lights.splice(toIndex, 0, item);
                };

                scope.toggleReorder = function () {
                    scope.showReorder = !scope.showReorder;
                };

                scope.showReorder = false;
            },
            templateUrl: 'js/directives/lightSelectionSortable/lightSelectionSortable.html'
        };
    };

    directive.$inject = ['$rootScope', '$filter', 'ColorDataService', 'DataService', 'UtilityService'];
    return directive;
});