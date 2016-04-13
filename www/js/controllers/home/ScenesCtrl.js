/*global angular, define, console, window, navigator,cordova*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $filter, $interval, $ionicLoading, $ionicFilterBar, DataService, HueService, UtilityService, $q, DbService, PlaceholderDataUrl) {
        console.info("ScenesCtrl init");
        var filterBarInstance;
        $scope.selectedTab = 1;

        $scope.$on("$ionicView.beforeEnter", function () {
            refresh();
        });

        function getIndexOf(arr, val, prop) {
            var l = arr.length,
                k = 0;
            for (k = 0; k < l; k = k + 1) {
                if (arr[k][prop] === val) {
                    return k;
                }
            }
            return false;
        }

        $scope.getUrlSrc = function (imageId) {
            if (angular.isDefined($scope.allImages) && imageId in $scope.allImages) {
                return $scope.allImages[imageId];
            } else
                return PlaceholderDataUrl;
        };

        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allScenes,
                update: function (filteredItems) {
                    $scope.allScenes = filteredItems;
                },
                filterProperties: 'name'
            });
        };

        $scope.activateScene = function (sceneId) {
            HueService.recallScene(sceneId).then(function (data) {

            });
        };

        $scope.deleteScene = function (sceneId) {
            HueService.deleteScene(sceneId).then(function (data) {
                DataService.removeCustomScene(sceneId);
                refresh();
            });
        };


        var refresh = function () {
            DbService.getAllImages()
                .then(function (images) {
                    var tmp = {};
                    angular.forEach(images, function (image) {
                        tmp[image.imageId] = image.imageData;
                    });
                    $scope.allImages = tmp;
                    console.log($scope.allImages);
                })
                .then(function () {
                    //$scope.customScenes = DataService.getCustomScenes();
                    var customScenes = DataService.getCustomScenes();
                    var rowSize = 2;
                    var customScenesRows = [];

                    var rowList = [];
                    angular.forEach(customScenes, function (scene) {
                        if (rowList.length === rowSize) {
                            customScenesRows.push(rowList);
                            rowList = [];
                        }
                        rowList.push(scene);
                    });
                    customScenesRows.push(rowList);
                    $scope.customScenesRows = customScenesRows;
                });


            HueService.getAllScenes().then(function (data) {
                var ret = [];
                angular.forEach(data, function (value, key) {
                    value.id = key;
                    if (!value.name.match(/\soff\s\d+/g)) {
                        value.name = value.name.replace(/\son\s\d+/, '').replace(/\sfon\s\d+/, '');
                        ret.push(value);
                    }
                });
                $scope.allScenes = ret;
                console.log($scope.allScenes);
            });

        };
    }

    ctrl.$inject = ['$scope', '$state', '$filter', '$interval', '$ionicLoading', '$ionicFilterBar', 'DataService', 'HueService', 'UtilityService', '$q', 'DbService', 'PlaceholderDataUrl'];
    return ctrl;

});