/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $interval, $ionicModal, DataService, HueService, UtilityService) {
        console.info("GroupsCtrl init");

        $scope.atLeastOneLightOn = false;
        $scope.changeOnOffGroup0 = function (newState) {
            DataService.getEnrichedLightInfos(false).then(function (data) {
                angular.forEach(data, function (value, key) {
                    DataService.stopEffect(key);
                });
            });

            HueService.turnGroupOnOff(0, newState).then(function (data) {
                $scope.atLeastOneLightOn = newState;
            });
        };
        $scope.turnGroupOn = function (groupId) {
            HueService.turnGroupOnOff(groupId, true).then(function (data) {

            });
        };
        $scope.deleteGroup = function (groupId) {
            HueService.deleteGroup(groupId, true).then(function (data) {
                refreshLightList();
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

        var refreshLightList = function () {
            DataService.getEnrichedGroupInfos().then(function (data) {
                console.log(data);
                var tmp = [];
                var lightGroups = [],
                    rooms = [];
                angular.forEach(data, function (value, key) {
                    value.id = key;
                    tmp.push(value);
                    if (value.type === "LightGroup")
                        lightGroups.push(value);
                    if (value.type === "Room")
                        rooms.push(value);
                });

                $scope.allGroups = tmp;
                $scope.lightGroups = lightGroups;
                $scope.rooms = rooms;

                window.setTimeout(checkIfAtLeastOneLightIsOn, 1000);
            });
        };

        refreshLightList();
        checkIfAtLeastOneLightIsOn();



        $ionicModal.fromTemplateUrl('createGroup-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.createGroupModal = modal;

            $scope.newGroup = {};
            $scope.newGroup.selectedGroupType = "lightGroup";
            $scope.newGroup.name = "";
            $scope.createGroupSelection = {};
            DataService.getEnrichedLightInfos(true).then(function (data) {
                $scope.allLights = data;
            });
        });

        $scope.openCreateGroupModal = function () {
            $scope.createGroupModal.show();
        };
        $scope.closeCreateGroupModal = function () {
            $scope.createGroupModal.hide();
        };
        $scope.createGroup = function () {
            var lights = [];
            angular.forEach($scope.createGroupSelection, function (value, key) {
                if (value === true) {
                    lights.push(key);
                }
            });

            var groupType = $scope.newGroup.selectedGroupType;
            console.log(groupType, $scope.newGroup.name)
            if (groupType === "lightGroup" && lights.length > 0 && $scope.newGroup.name.length > 0) {
                HueService.createGroup($scope.newGroup.name, lights).then(function (data) {
                    refreshLightList();
                    $scope.closeCreateGroupModal();
                });
            } else if (groupType === "room" && $scope.newGroup.name.length > 0) {
                console.log("room")
                HueService.createRoom($scope.newGroup.name, $scope.selectedRoomType, lights).then(function (data) {
                    refreshLightList();
                    $scope.closeCreateGroupModal();
                });
            } else {
                $scope.closeCreateGroupModal();
            }
        };
    }

    ctrl.$inject = ['$scope', '$state', '$interval', '$ionicModal', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
