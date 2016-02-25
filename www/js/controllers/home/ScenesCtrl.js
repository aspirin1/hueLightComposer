/*global angular, define, console, window, navigator,cordova*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $filter, $interval, $ionicLoading, $ionicFilterBar, DataService, HueService, UtilityService, $q) {
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

        $scope.getUrlSrc = function (imageUrl) {
            return UtilityService.getUrlForImage(imageUrl);
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
                refresh();
            });
        };


        var refresh = function () {
            HueService.getAllScenes().then(function (data) {
                var ret = [];
                angular.forEach(data, function (value, key) {
                    value.id = key;
                    ret.push(value);
                });
                $scope.allScenes = ret;
            });

            $scope.customScenes = DataService.getCustomScenes();
            console.log($scope.customScenes);
        };
    }

    ctrl.$inject = ['$scope', '$state', '$filter', '$interval', '$ionicLoading', '$ionicFilterBar', 'DataService', 'HueService', 'UtilityService', '$q'];
    return ctrl;

});
