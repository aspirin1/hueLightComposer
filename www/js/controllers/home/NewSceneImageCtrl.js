/*global angular, define, console, window, navigator,cordova,document, Image*/

define(function () {
    'use strict';

    function ctrl($scope, $ionicHistory, $state, $filter, DataService, HueService, UtilityService, HelperService) {
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
            var canvas = document.getElementById("canvas");
            canvas.width = 400;
            canvas.height = 400;

            var image = new Image();
            image.src = $scope.image.myCroppedImage;
            canvas.getContext("2d").drawImage(image, 0, 0);
            var jpgDataUrlSrc = canvas.toDataURL("image/jpeg");

            console.log($scope.image.myImage);
            console.log($scope.image.myCroppedImage);
            console.log(jpgDataUrlSrc);

            var imageName = HelperService.getNewGuid();
            var imageUrl = imageName + ".jpg";

            UtilityService.writeBase64ImageToFilesSystem(imageUrl, jpgDataUrlSrc).then(function () {
                DataService.setSceneImageCropped(imageUrl);
                console.log(imageUrl, DataService.getSceneImageCropped());
                $scope.back();
            });
        };

        $scope.back = function () {
            $ionicHistory.goBack();
        };
    }

    ctrl.$inject = ['$scope', '$ionicHistory', '$state', '$filter', 'DataService', 'HueService', 'UtilityService', 'HelperService'];
    return ctrl;

});
