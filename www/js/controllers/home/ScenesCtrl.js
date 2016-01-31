/*global angular, define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $filter, $interval, $ionicLoading, DataService, HueService, UtilityService) {
        console.info("ScenesCtrl init");

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
                })
                .finally(function () {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        refresh();
    }

    ctrl.$inject = ['$scope', '$state', '$filter', '$interval', '$ionicLoading', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
