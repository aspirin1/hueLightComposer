/*global angular, define, console, window*/

define(function () {
    'use strict';

    function ctrl($ionicLoading, $scope, $filter, $ionicModal, $ionicPopover, $ionicListDelegate, DataService) {


        $scope.$on("$ionicView.beforeEnter", function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            getAllColors();
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


            var predicate = orderCmd;
            var reverse = false;

            $scope.colors = orderBy($scope.colors, predicate, reverse);
            $scope.ownColors = orderBy($scope.ownColors, predicate, reverse);
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

        var getAllColors = function () {
            DataService.getAllColors().then(function (colors) {
                $scope.ownColors = colors.ownColors;

                $scope.colors = colors.shippedColors;
                reloadSorting();
                $ionicLoading.hide();
            });
        };

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.allLights = tmp;
            $scope.copyToLightsInSelection = tmp;
        });

        $scope.listFilter = function (color) {
            var show = true;
            if ($scope.filter.red || $scope.filter.green) {
                if ($scope.filter.red && (color.hsl.h < 30 || color.hsl.h > 330)) {
                    show = true;
                } else if ($scope.filter.green && (color.hsl.h >= 80 && color.hsl.h <= 140)) {
                    show = true;
                } else {
                    show = false;
                }
            }

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


            return show;
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

        $scope.getFillerSquares = function () {
            var ret = [];
            for (var i = 0; i < 30; i++)
                ret.push(i);
            return ret;
        };

        $scope.openCopyToModal = function (color) {
            $scope.modalColor = color;

            $ionicModal.fromTemplateUrl('templates/home/modals/copyToModal.html', {
                scope: $scope,
                id: 'copyToModal',
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.copyToModal = modal;
                $scope.copyToModal.show();
            });
        };

        $ionicPopover.fromTemplateUrl('filter-popover.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $ionicPopover.fromTemplateUrl('sort-popover.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (popover) {
            $scope.sortPopover = popover;
        });
    }

    ctrl.$inject = ['$ionicLoading', '$scope', '$filter', '$ionicModal', '$ionicPopover', '$ionicListDelegate', 'DataService'];
    return ctrl;

});