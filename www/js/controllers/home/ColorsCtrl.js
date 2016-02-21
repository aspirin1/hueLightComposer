/*global angular, define, console, window*/

define(function () {
    'use strict';

    function ctrl($ionicLoading, $scope, $state, $filter, $interval, $ionicModal, $ionicPopover, $ionicListDelegate, DataService, HueService, UtilityService, ColorService) {
        console.info("ColorsCtrl init");

        $ionicLoading.show({
            template: 'Loading...'
        });

        $scope.filter = {
            'showFavorites': false,
            'a': false,
            'b': false,
            'c': false,
            'showCustoms': false,
            'red': false,
            'green': false
        };

        $scope.orderItems = [
            {
                id: 2,
                text: "Luminance",
                order: "desc",
                orderItem: "hsl.l"
            },
            {
                id: 0,
                text: "Hue",
                order: "asc",
                orderItem: "hsl.h"
            },
            {
                id: 1,
                text: "Saturation",
                order: "asc",
                orderItem: "hsl.s"
            }, ];

        $scope.data = {
            showReorder: false,
            listCanSwipe: true,
        };

        var reloadSorting = function () {
            var orderBy = $filter('orderBy');
            var orderCmd = [];

            angular.forEach($scope.orderItems, function (value) {
                var cmd = value.orderItem;
                if (value.order === "desc") {
                    cmd = "-" + cmd;
                }
                orderCmd.push(cmd);
            });

            console.log(orderCmd);
            var predicate = orderCmd;
            var reverse = false;

            $scope.colors = orderBy($scope.colors, predicate, reverse);
        };

        $scope.asc = function (item) {
            item.order = "asc";
            $ionicListDelegate.$getByHandle('sorting-options').closeOptionButtons();
            reloadSorting();
        };

        $scope.desc = function (item) {
            item.order = "desc";
            $ionicListDelegate.$getByHandle('sorting-options').closeOptionButtons();
            reloadSorting();
        };

        $scope.ascDescToggle = function (item) {
            if (item.order === "asc")
                item.order = "desc";
            else
                item.order = "asc";
            reloadSorting();
        };

        $scope.moveItem = function (item, fromIndex, toIndex) {
            $scope.orderItems.splice(fromIndex, 1);
            $scope.orderItems.splice(toIndex, 0, item);
            reloadSorting();
        };

        DataService.getAllColors().then(function (colors) {
            $scope.colors = colors;
            reloadSorting();
            $ionicLoading.hide();
        });

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.allLights = tmp;
        });

        $scope.listFilter = function (color) {
            if ($scope.filter.showFavorites && !color.isFavorite) {
                return false;
            }
            if ($scope.filter.a && !color.isReachableByGamutA) {
                return false;
            }
            if ($scope.filter.b && !color.isReachableByGamutB) {
                return false;
            }
            if ($scope.filter.c && !color.isReachableByGamutC) {
                return false;
            }
            if ($scope.filter.showCustoms && !color.isCustom) {
                return false;
            }



            if ($scope.filter.red || $scope.filter.green) {
                if ($scope.filter.red && (color.hsl.h < 30 || color.hsl.h > 330)) {
                    return true;
                }
                if ($scope.filter.green && (color.hsl.h >= 80 && color.hsl.h <= 140)) {
                    return true;
                }
                return false;
            }

            return true;
        };

        $scope.toggleFavorite = function (color) {
            color.isFavorite = !color.isFavorite;
            DataService.toggleFavorite(color.hexColor);
        };

        $scope.getBackgroundStyle = function (hexColor) {
            return {
                'background-color': hexColor.toString()
            };
        };

        $scope.openCopyToModal = function (color) {
            console.info(color);
            $scope.modalColor = color;

            $ionicModal.fromTemplateUrl('copyto-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.copyToModal = modal;
                $scope.copyToModal.show();
            });
        };

        $scope.closeCopyToModal = function () {
            console.log($scope.copySelection);
            $scope.copyToModal.hide();
        };

        function getLightById(key) {
            for (var i = 0; i < $scope.allLights.length; i++) {
                if ($scope.allLights[i].id === key) {
                    return $scope.allLights[i];
                }
            }
        }

        $scope.getCopyToSelectedColorStyle = function () {
            if (!angular.isDefined($scope.modalColor))
                return {};
            return {
                'background-color': $scope.modalColor.hexColor
            };
        };

        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var mc = $scope.modalColor;
                    var light = getLightById(key);

                    var gamutXy = ColorService.getGamutXyFromHex(light.gamut, mc.hexColor); //mc["gamut" + light.gamut];
                    HueService.changeLightState(key, {
                        on: true,
                        xy: gamutXy
                    });
                }
            });
            $scope.closeCopyToModal();
        };

        $ionicPopover.fromTemplateUrl('filter-popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $ionicPopover.fromTemplateUrl('sort-popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.sortPopover = popover;
        });
    }

    ctrl.$inject = ['$ionicLoading', '$scope', '$state', '$filter', '$interval', '$ionicModal', '$ionicPopover', '$ionicListDelegate', 'DataService', 'HueService', 'UtilityService', 'ColorService'];
    return ctrl;

});
