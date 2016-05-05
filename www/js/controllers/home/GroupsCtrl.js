/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $ionicModal, DataService, HueService) {


        $scope.allLightsOfGroupAreOn = {};

        var refreshLightInfos = function () {
            DataService.getEnrichedLightInfos(true).then(function (data) {
                var tmp = [];
                angular.forEach(data, function (value, key) {
                    value.id = key;
                    tmp.push(value);
                });
                $scope.lights = tmp;
            });
        };

        var refreshView = function () {
            refreshLightInfos();
            refreshLightList();
        };

        $scope.$on("$ionicView.beforeEnter", function () {
            refreshView();
        });

        $scope.atLeastOneLightOn = false;
        $scope.changeOnOffGroup0 = function () {
            var newState = !$scope.atLeastOneLightOn;
            angular.forEach($scope.lights, function (value, key) {
                DataService.stopEffect(key);
            });

            HueService.turnGroupOnOff(0, newState).then(function (data) {
                $scope.atLeastOneLightOn = newState;
                angular.forEach($scope.allLightsOfGroupAreOn, function (value, key) {
                    value = false;
                });
            });
        };
        $scope.turnGroupOnOff = function (group) {
            var newValue = $scope.allLightsOfGroupAreOn[group.id];
            HueService.turnGroupOnOff(group.id, newValue).then(function (data) {
                $scope.allLightsOfGroupAreOn[group.id] = newValue;
                refreshView();
            });
        };

        var checkGroupState = function () {
            angular.forEach($scope.allGroups, function (group) {
                $scope.allLightsOfGroupAreOn[group.id] = allLightsOfGroupAreOn(group);
            });
        };

        var allLightsOfGroupAreOn = function (group) {
            var cnt = 0;
            angular.forEach(group.lights, function (groupLightId) {
                angular.forEach($scope.lights, function (light) {
                    if (light.id === groupLightId && light.state.on) {
                        cnt++;
                    }
                });
            });
            return cnt === group.lights.length;
        };

        $scope.deleteGroup = function (groupId) {
            HueService.deleteGroup(groupId, true).then(function (data) {
                refreshView();
            });
        };

        var checkIfAtLeastOneLightIsOn = function () {
            var atLeastOneOn = false;
            angular.forEach($scope.lights, function (value, key) {
                if (value.state.on) {
                    atLeastOneOn = true;
                    return;
                }
            });
            $scope.atLeastOneLightOn = atLeastOneOn;
        };

        var refreshLightList = function () {
            DataService.getEnrichedGroupInfos(true).then(function (data) {

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

                checkIfAtLeastOneLightIsOn();
                checkGroupState();
            });
        };

        $ionicModal.fromTemplateUrl('createGroup-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.createGroupModal = modal;
        });

        $scope.openCreateGroupModal = function () {
            $scope.newGroup = {};
            $scope.newGroup.selectedGroupType = "lightGroup";
            $scope.newGroup.name = "";
            $scope.createGroupSelection = {};
            DataService.getEnrichedLightInfos(true).then(function (data) {
                $scope.allLights = data;
            });
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
            if (groupType === "lightGroup" && lights.length > 0 && $scope.newGroup.name.length > 0) {
                HueService.createGroup($scope.newGroup.name, lights).then(function (data) {
                    refreshLightList();
                    $scope.closeCreateGroupModal();
                });
            } else if (groupType === "room" && $scope.newGroup.name.length > 0) {
                HueService.createRoom($scope.newGroup.name, $scope.selectedRoomType, lights).then(function (data) {
                    refreshLightList();
                    $scope.closeCreateGroupModal();
                });
            } else {
                $scope.closeCreateGroupModal();
            }
        };
    }

    ctrl.$inject = ['$scope', '$ionicModal', 'DataService', 'HueService'];
    return ctrl;

});