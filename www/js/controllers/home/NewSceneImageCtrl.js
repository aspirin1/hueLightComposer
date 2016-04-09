/*global angular, define, console, window, navigator,cordova,document, Image*/

define(function () {
    'use strict';

    function ctrl($q, $scope, $ionicHistory, $state, $filter, DataService, HueService, UtilityService, HelperService) {
        console.info("NewSceneImageCtrl init");

        $scope.$on("$ionicView.beforeEnter", function () {
            refresh();
        });

        function convertFileToDataURLviaFileReader(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function () {

                callback(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        }

        function getBase64FromImageUrl(url) {
            var deferred = $q.defer();
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = function () {
                var canvas = document.getElementById("canvas");
                canvas.width = this.width;
                canvas.height = this.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);

                var dataURL = canvas.toDataURL("image/jpeg");
                deferred.resolve(dataURL);
            };
            img.src = url;
            return deferred.promise;
        }

        var getImage = function () {
            var imageData = DataService.getSceneImage();
            $scope.image.myImage = "data:image/jpeg;base64," + imageData;
        };

        $scope.image = {};
        getImage();

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

            DataService.setSceneImageCropped(jpgDataUrlSrc);
            $scope.back();
        };

        $scope.back = function () {
            $ionicHistory.goBack();
        };
    }

    ctrl.$inject = ['$q', '$scope', '$ionicHistory', '$state', '$filter', 'DataService', 'HueService', 'UtilityService', 'HelperService'];
    return ctrl;

});
