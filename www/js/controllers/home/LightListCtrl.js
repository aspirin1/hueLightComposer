/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($state, $filter, $scope, $ionicModal, DataService, HueService, UtilityService, LightCommandService, ColorService, ConfigService) {
        console.info("HueLightListCtrl init");




        $scope.$on("$ionicView.beforeEnter", function () {
            console.log("beforeEnter", ConfigService.getBridgeUrl(), ConfigService.getUserId());
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

        $scope.test = function (lightId) {

            var dark_blue = ColorService.getXysFromHex("#1e228d");
            for (var i = 1; i < 4; i++) {
                LightCommandService.kurzesHellesAufleuchten(i, dark_blue.gamutCxy, 15000);
                //LightCommandService.schnellesBlinken(lightId, 100, 5000);
                //LightCommandService.farbverlaufUndZurück(lightId, 30000, 15000);
                //LightCommandService.helligkeitsFlackernDunklerRegelmaessig(lightId, 70, 30000);
                //LightCommandService.helligkeitsFlackernHellerRegelmaessig(lightId, 120, 10000);
                //LightCommandService.helligkeitsFlackernDunklerMehrstufig(lightId, 70, 20000);
                //LightCommandService.helligkeitsFlackernDunklerMehrstufigZufall(lightId, 80, 60000);
                //LightCommandService.ausUndUnregelmaessigAufblitzen(i, 500, 7000, 60000);
            }
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
            $scope.newScene.image = undefined;
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
                    console.log(data);
                    DataService.addCustomScene(data[0].success.id, $scope.newScene.name, tmp, $scope.newScene.image);
                    $scope.closeCreateSceneModal();
                });
            } else {
                $scope.closeCreateSceneModal();
            }
        };

        $scope.scenePictureAlbum = function () {
            UtilityService.getAndStorePictureAlbum().then(function (data) {
                console.log(data);
                $scope.newScene.image = data;
            });
        };
        $scope.scenePictureCamera = function () {
            UtilityService.getAndStorePictureCamera().then(function (data) {
                console.log(data);
                $scope.newScene.image = data;
            });
        };
        //        $scope.urlForImage = function () {
        //            if (angular.isDefined($scope.newScene) && typeof ($scope.newScene.image) !== "undefined") {
        //                return UtilityService.getUrlForImage($scope.newScene.image);
        //            } else {
        //                return "";
        //            }
        //        };

        //        $scope.$on("$destroy", function () {
        //            $interval.cancel(interval);
        //        });
    }

    ctrl.$inject = ['$state', '$filter', '$scope', '$ionicModal', 'DataService', 'HueService', 'UtilityService', 'LightCommandService', 'ColorService', 'ConfigService'];
    return ctrl;

});
