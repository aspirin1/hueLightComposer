/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $ionicSideMenuDelegate) {
        $scope.toggleLeftSideMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
    }

    ctrl.$inject = ['$scope', '$state', '$ionicSideMenuDelegate'];
    return ctrl;

});
