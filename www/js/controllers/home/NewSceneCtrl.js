/*global angular, define, console, window, navigator,cordova*/

define(function () {
    'use strict';

    function ctrl($scope, $ionicHistory, $state, $filter, DataService, HueService, UtilityService) {
        console.info("New ScenesCtrl init");

        var resetForm = function () {
            $scope.createSceneSelection = {};
            $scope.newScene = {};
            $scope.newScene.name = '';
            DataService.setSceneImageCropped(null);
            DataService.setSceneImage(null);
        };

        resetForm();

        $scope.$on("$ionicView.beforeEnter", function () {
            refresh();
        });

        var refresh = function () {
            DataService.getEnrichedLightInfos(true).then(function (data) {
                var tmp = [];
                angular.forEach(data, function (value, key) {
                    value.id = key;
                    tmp.push(value);
                });
                $scope.allLights = tmp;
            });
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
                    DataService.addCustomScene(data[0].success.id, $scope.newScene.name, tmp, DataService.getSceneImageCropped());
                    resetForm();
                    $state.go('main.home_tab.scenes');
                });
            }
        };

        $scope.scenePictureAlbum = function () {
            UtilityService.getAndStorePictureAlbum().then(function (data) {
                console.log(data);
                $scope.newScene.image = data;
                DataService.setSceneImage(data);
                $state.go('main.home_tab.newSceneImage');
            });
        };

        $scope.scenePictureCamera = function () {
            UtilityService.getAndStorePictureCamera().then(function (data) {
                console.log(data);
                $scope.newScene.image = data;
                DataService.setSceneImage(data);

                $state.go('main.home_tab.newSceneImage');
            });
        };

        $scope.newCrop = function () {
            $state.go('main.home_tab.newSceneImage');
        };

        $scope.croppedImageAvailable = function () {
            var croppedImageUrl = DataService.getSceneImageCropped();
            return croppedImageUrl !== null;
        };

        $scope.urlForImage = function () {
            if ($scope.croppedImageAvailable()) {
                return UtilityService.getUrlForImage(DataService.getSceneImageCropped());
            } else {
                return "";
            }
        };

        $scope.back = function () {
            resetForm();
            $ionicHistory.goBack();
        };
    }

    ctrl.$inject = ['$scope', '$ionicHistory', '$state', '$filter', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
