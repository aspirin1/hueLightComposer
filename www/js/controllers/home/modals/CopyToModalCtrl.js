/*global angular, define, console, window, navigator*/

define(function () {
    'use strict';

    function ctrl(HueService, $scope, ColorService, $ionicModal) {
        $scope.$on('modal.shown', function (event, modal) {
            if (modal.id === "copyToModal") {
                $scope.copySelection = {};
            }
        });

        $scope.getCopyToSelectedColorStyle = function () {
            if (!angular.isDefined($scope.modalColor))
                return {};
            return {
                'background-color': $scope.modalColor.hexColor
            };
        };
        $scope.getCopyToSelectedColorFontStyle = function () {
            if (!angular.isDefined($scope.modalColor))
                return {};
            return {
                'color': $scope.modalColor.hexColor
            };
        };

        $scope.copySelection = {};


        $scope.closeCopyToModal = function () {
            $scope.copyToModal.hide();
        };

        function getLightById(key) {
            for (var i = 0; i < $scope.copyToLightsInSelection.length; i++) {
                if ($scope.copyToLightsInSelection[i].id === key) {
                    return $scope.copyToLightsInSelection[i];
                }
            }
        }

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
    }

    ctrl.$inject = ['HueService', '$scope', 'ColorService', '$ionicModal'];
    return ctrl;

});