/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $interval, $ionicLoading, DataService, HueService, UtilityService) {
        console.info("GroupsCtrl init");

        $scope.atLeastOneLightOn = false;
        $scope.changeOnOffGroup0 = function (newState) {
            HueService.turnGroupOnOff(0, newState).then(function (data) {
                $scope.atLeastOneLightOn = newState;
            });
        };

        var checkIfAtLeastOneLightIsOn = function () {

            DataService.getEnrichedLightInfos(true).then(function (data) {
                var atLeastOneOn = false;
                angular.forEach(data, function (value, key) {
                    if (value.state.on) {
                        atLeastOneOn = true;
                        return;
                    }
                });
                $scope.atLeastOneLightOn = atLeastOneOn;
            });
        };

        checkIfAtLeastOneLightIsOn();

        var refreshLightList = function () {
            DataService.getEnrichedGroupInfos().then(function (data) {
                    console.log(data);
                    $scope.allGroups = data;
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


    }

    ctrl.$inject = ['$scope', '$state', '$interval', '$ionicLoading', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
