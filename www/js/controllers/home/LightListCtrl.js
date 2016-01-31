/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $interval, $ionicLoading, $ionicModal, DataService, HueService, UtilityService) {
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

        $ionicModal.fromTemplateUrl('createScene-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.createSceneModal = modal;
        });

        $scope.openCreateSceneModal = function () {
            $scope.createSceneSelection = {};
            $scope.newScene = {};
            $scope.newScene.name = '';
            $scope.createSceneModal.show();
        };
        $scope.closeCreateSceneModal = function () {
            $scope.createSceneModal.hide();
        };

        $scope.createScene = function () {
            var tmp = [];

            angular.forEach($scope.createSceneSelection, function (value, key) {
                if (value === true) {
                    tmp.push(key);
                }
            });

            if (tmp.length > 0 && $scope.newScene.name.length > 0) {
                HueService.createScene($scope.newScene.name, tmp).then(function (data) {
                    $scope.closeCreateSceneModal();
                });
            } else {
                $scope.closeCreateSceneModal();
            }
        };

        //        $scope.$on("$destroy", function () {
        //            $interval.cancel(interval);
        //        });
    }

    ctrl.$inject = ['$scope', '$state', '$interval', '$ionicLoading', '$ionicModal', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
