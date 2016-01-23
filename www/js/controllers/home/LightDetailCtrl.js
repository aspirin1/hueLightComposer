/*global define, console, window*/
define(function () {
    'use strict';

    function ctrl($scope, $state, $interval, $ionicLoading, DataService, HueService, UtilityService) {
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


        //        $scope.$on("$destroy", function () {
        //            $interval.cancel(interval);
        //        });
    }

    ctrl.$inject = ['$scope', '$state', '$interval', '$ionicLoading', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
