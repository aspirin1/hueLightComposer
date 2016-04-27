/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($state, $filter, $scope, $ionicModal, DataService, HueService, UtilityService, ColorService, ConfigService) {





        $scope.$on("$ionicView.beforeEnter", function () {

            if (ConfigService.getBridgeUrl() === null || ConfigService.getUserId() === null) {
                $state.go('searchingBridge');
            } else {
                refreshLightList();
            }
        });

        var refreshLightList = function () {
            DataService.getEnrichedLightInfos(true).then(function (data) {
                var tmp = [];
                angular.forEach(data, function (value, key) {
                    value.id = key;
                    tmp.push(value);
                });
                $scope.allLights = tmp;
            });
        };



        $scope.isEffectRunning = function (lightId) {
            var retVal = false;

            if ($scope.allLights.length > 0) {
                var eff = DataService.getEffect(lightId);
                if (angular.isDefined(eff)) {
                    retVal = true;
                }
            }

            return retVal;
        };

        $scope.getEffectRunning = function (lightId) {
            if ($scope.allLights.length > 0) {
                var eff = DataService.getEffect(lightId);
                if (angular.isUndefined(eff)) {
                    return $filter('translate')('NO_EFFECT_RUNNING');
                } else {
                    return $filter('translate')('Effect_' + eff.effect);
                }
            }
        };

        $scope.stopEffect = function (lightId) {
            DataService.stopEffect(lightId);
        };

        $scope.getPathToLight = function (lightId) {
            return "#/main/home_tab/lightDetail/" + lightId;
        };

        $scope.doRefresh = function () {
            refreshLightList();
        };

        $scope.toggleLightOnOff = function (lightId, light) {
            if (light.state.on === false) {
                DataService.stopEffectAndTurnOffLight(lightId);
            } else {
                HueService.turnLightOnOff(lightId, light.state.on).then(function (data) {
                    //refreshLightList();
                });
            }
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

        $ionicModal.fromTemplateUrl('templates/home/modals/sceneModal.html', {
            id: 'sceneModal',
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.sceneModal = modal;
        });

        $scope.openCreateSceneModal = function () {
            $scope.sceneModal.show();
        };


        //        $scope.$on("$destroy", function () {
        //            $interval.cancel(interval);
        //        });
    }

    ctrl.$inject = ['$state', '$filter', '$scope', '$ionicModal', 'DataService', 'HueService', 'UtilityService', 'ColorService', 'ConfigService'];
    return ctrl;

});
