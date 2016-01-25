/*global angular, define, console, window*/
define(function () {
    'use strict';

    function ctrl($scope, $state, $interval, $ionicLoading, $ionicModal, DataService, HueService, UtilityService) {
        console.info("HueLightDetailsCtrl init", $scope.lightId);

        var refreshLightInfo = function () {
            DataService.getEnrichedLightInfo($scope.lightId).then(function (data) {
                    console.log("refreshed!");
                    $scope.light = data;
                })
                .finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        refreshLightInfo();

        //        var interval = $interval(function () {
        //            refreshLightInfo();
        //        }, 5000);

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                if (key !== $scope.lightId) {
                    value.id = key;
                    tmp.push(value);
                }
            });
            $scope.allLightsExceptCurrent = tmp;
        });

        $scope.doRefresh = function () {
            refreshLightInfo();
        };

        $scope.toggleLightOnOff = function () {
            //$ionicLoading.show();
            HueService.turnLightOnOff($scope.lightId, $scope.light.state.on).then(function (data) {
                refreshLightInfo();
            });
        };

        $scope.toggleColorloop = function () {
            var doColorLoop = $scope.light.state.effect === "colorloop";
            $scope.light.state.on = true;
            HueService.toggleColorloop($scope.lightId, doColorLoop).then(function (data) {
                //refreshLightList();
            });
        };

        $scope.getBrightnessPercentage = function (light) {
            if (typeof ($scope.light) !== "undefined") {
                var maxBri = 254.0;
                var lightBri = $scope.light.state.bri;
                return UtilityService.calculateFormattedPercentage(maxBri, lightBri);
            }
        };

        $scope.getSaturationPercentage = function (light) {
            if (typeof ($scope.light) !== "undefined") {
                var maxSat = 254.0;
                var lightBri = $scope.light.state.sat;
                return UtilityService.calculateFormattedPercentage(maxSat, lightBri);
            }
        };

        $scope.brightnessChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.bri;
                HueService.changeBrightness($scope.lightId, val);
            }
        };

        $scope.saturationChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.sat;
                HueService.changeSaturation($scope.lightId, val);
            }
        };

        $scope.hueChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.hue;
                HueService.changeHue($scope.lightId, val);
            }
        };


        $ionicModal.fromTemplateUrl('rename-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.renameModal = modal;
        });

        $scope.openModal = function () {
            $scope.renameModal.show();
        };
        $scope.closeModal = function () {
            $scope.renameModal.hide();
        };
        $scope.changeLightName = function (newName) {
            HueService.renameLight($scope.lightId, newName).then(function (data) {
                $scope.light.name = newName;
                $scope.modal.hide();
            });
        };
        $scope.$on('$destroy', function () {
            $scope.renameModal.remove();
            $scope.copyToModal.remove();
        });


        $scope.copySelection = {};
        $ionicModal.fromTemplateUrl('copyto-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.copyToModal = modal;
        });

        $scope.openCopyToModal = function () {
            $scope.copyToModal.show();
        };
        $scope.closeCopyToModal = function () {
            $scope.copyToModal.hide();
        };

        $scope.copyToSelection = function () {
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    HueService.changeLightState(key, {
                        bri: parseInt($scope.light.state.bri),
                        sat: parseInt($scope.light.state.sat),
                        hue: parseInt($scope.light.state.hue),
                    });
                }
            });
            $scope.closeCopyToModal();
        };

        //        $scope.$on("$destroy", function () {
        //            $interval.cancel(interval);
        //        });
    }

    ctrl.$inject = ['$scope', '$state', '$interval', '$ionicLoading', '$ionicModal', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
