/*global angular, define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $interval, $ionicLoading, DataService, HueService, UtilityService) {
        console.info("ScenesCtrl init");

        $scope.activateScene = function (sceneId) {
            HueService.recallScene(sceneId).then(function (data) {

            });
        };

        HueService.getAllScenes().then(function (data) {
                console.log(data);
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
    }

    ctrl.$inject = ['$scope', '$state', '$interval', '$ionicLoading', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
