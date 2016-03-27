/*global angular, define, console, window, navigator,cordova*/

define(function () {
    'use strict';

    function ctrl($scope, $ionicHistory, $state, $filter, DataService, HueService, UtilityService) {
        console.info("NewSceneImageCtrl init");

        $scope.$on("$ionicView.beforeEnter", function () {
            refresh();
        });

        $scope.image = {};
        $scope.image.myImage = UtilityService.getUrlForImage(DataService.getSceneImage());
        //$scope.myCroppedImage = '';
        //$scope.croppedBlob = '';
        //$scope.croppedBlobUrl = '';

        var refresh = function () {

        };

        $scope.saveImage = function () {
            console.log($scope.image.myImage);
            console.log($scope.image.myCroppedImage);
            console.log($scope.image.croppedBlob);
            console.log($scope.image.croppedBlobUrl);
        };

        $scope.back = function () {
            $ionicHistory.goBack();
        };
    }

    ctrl.$inject = ['$scope', '$ionicHistory', '$state', '$filter', 'DataService', 'HueService', 'UtilityService'];
    return ctrl;

});
