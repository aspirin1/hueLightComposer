/*global angular, define, console, window, navigator,cordova*/

define(function () {
    'use strict';

    function ctrl($scope, $ionicHistory, $state, $filter, DataService, HueService, UtilityService) {
        console.info("New ScenesCtrl init");

        $scope.$on("$ionicView.beforeEnter", function () {
            refresh();
        });

        $scope.myImage = $scope.myImage = UtilityService.getUrlForImage(DataService.getSceneImage());
        $scope.myCroppedImage = '';

        console.log("myImage", $scope.myImage)

        var refresh = function () {
            $scope.createSceneSelection = {};
            $scope.newScene = {};
            $scope.newScene.name = '';
            $scope.newScene.image = undefined;

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
                    DataService.addCustomScene(data[0].success.id, $scope.newScene.name, tmp, $scope.newScene.image);
                });
            }
        };

        $scope.scenePictureAlbum = function () {
            UtilityService.getAndStorePictureAlbum().then(function (data) {
                console.log(data);
                $scope.newScene.image = data;
                DataService.setSceneImage(data);
                $state.go('main.home_tab.newSceneImage');

                $scope.myImage = UtilityService.getUrlForImage(data);
            });
        };

        $scope.scenePictureCamera = function () {
            UtilityService.getAndStorePictureCamera().then(function (data) {
                console.log(data);
                $scope.newScene.image = data;
                DataService.setSceneImage(data);


                $scope.myImage = UtilityService.getUrlForImage(data);
                console.log($scope.myImage);

                $state.go('main.home_tab.newSceneImage');
            });
        };

        $scope.urlForImage = function () {
            if (angular.isDefined($scope.newScene) && typeof ($scope.newScene.image) !== "undefined") {
                return UtilityService.getUrlForImage($scope.newScene.image);
            } else {
                return "";
            }
        };

        $scope.back = function () {
            $ionicHistory.goBack();
        };
    }

    ctrl.$inject = ['$scope', '$ionicHistory', '$state', '$filter', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
