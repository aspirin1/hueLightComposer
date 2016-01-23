/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $interval, $ionicLoading, DataService, HueService, UtilityService) {
        console.info("HueLightListCtrl init");


        var refreshLightList = function () {
            DataService.getEnrichedLightInfos(true).then(function (data) {
                    $scope.allLights = data;
                })
                .finally(function () {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        refreshLightList();


        //        var interval = $interval(function () {
        //            refreshLightList();
        //        }, 5000);



        $scope.getPathToLight = function (lightId) {
            return "#/main/home_tab/lightDetail/" + lightId;
        };

        $scope.doRefresh = function () {
            refreshLightList();
        };

        $scope.toggleLightOnOff = function (lightId, light) {
            HueService.turnLightOnOff(lightId, light.state.on).then(function (data) {
                //refreshLightList();
            });
        };
        $scope.getBrightnessPercentage = function (light) {
            var maxBri = 254.0;
            var lightBri = light.state.bri;
            return UtilityService.calculateFormattedPercentage(maxBri, lightBri);
        };

        $scope.getSaturationPercentage = function (light) {
            var maxSat = 254.0;
            var lightBri = light.state.sat;
            return UtilityService.calculateFormattedPercentage(maxSat, lightBri);
        };

        //        $scope.$on("$destroy", function () {
        //            $interval.cancel(interval);
        //        });
    }

    ctrl.$inject = ['$scope', '$state', '$interval', '$ionicLoading', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
