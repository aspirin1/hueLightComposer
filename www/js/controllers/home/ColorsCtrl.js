/*global angular, define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $filter, $interval, $ionicModal, DataService, HueService, UtilityService) {
        console.info("ColorsCtrl init");
        $scope.colors = DataService.getCustomColors();

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.allLights = tmp;
        });

        $scope.getBackgroundStyle = function (hexColor) {
            return {
                'background-color': hexColor.toString()
            };
        };

        $scope.copySelection = {};
        $ionicModal.fromTemplateUrl('copyto-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.copyToModal = modal;
        });

        $scope.openCopyToModal = function (color) {
            $scope.copyToModal.show();
            $scope.modalColor = color;
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

        $scope.copyToSelection = function () {
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var mc = $scope.modalColor;
                    var light = getLightById(key);
                    var gamutXy = mc["gamut" + light.gamut];
                    console.log(light, mc, gamutXy);
                    HueService.changeLightState(key, {
                        on: true,
                        xy: gamutXy
                    });
                }
            });
            $scope.closeCopyToModal();
        };
    }

    ctrl.$inject = ['$scope', '$state', '$filter', '$interval', '$ionicModal', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
