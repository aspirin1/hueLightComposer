/*global angular, define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $filter, $interval, $ionicModal, $ionicPopover, DataService, HueService, UtilityService) {
        console.info("ColorsCtrl init");
        $scope.filter = {
            'showFavorites': false,
            'a': false,
            'b': false,
            'c': false
        };
        $scope.colors = DataService.getCustomColors();

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
                    var gamutXy = mc["gamut" + light.gamut];
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
    }

    ctrl.$inject = ['$scope', '$state', '$filter', '$interval', '$ionicModal', '$ionicPopover', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
