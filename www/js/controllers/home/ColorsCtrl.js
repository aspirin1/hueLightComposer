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

        $scope.copyToSelection = function () {
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var mc = $scope.modalColor;
                    HueService.changeLightState(key, {
                        on: true,
                        bri: parseInt(mc.bri),
                        sat: parseInt(mc.sat),
                        hue: parseInt(mc.hue),
                    });
                }
            });
            $scope.closeCopyToModal();
        };
    }

    ctrl.$inject = ['$scope', '$state', '$filter', '$interval', '$ionicModal', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
