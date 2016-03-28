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
                //                var reader = new FileReader();
                //                reader.onloadend = function () {
                //                    callback(reader.result);
                //                };
                //                reader.readAsDataURL(xhr.response);
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
                //console.log("dataURL", dataURL);
                deferred.resolve(dataURL);
            };
            img.src = url;
            return deferred.promise;
        }

        var getImage = function () {
            var imageName = DataService.getSceneImage();
            var imageFullPath = UtilityService.getUrlForImage(imageName);

            //            if (angular.isDefined(imageFullPath) && imageFullPath !== null) {
            //                getBase64FromImageUrl(imageFullPath).then(function (data) {
            //                    //console.log("resolved", data);
            //                    $scope.image.myImage = data;
            //                });
            //            }
            //
            //            convertFileToDataURLviaFileReader(imageFullPath, function (data) {
            //                console.log("resolved2", data);
            //                deferred.resolve(data);
            //            });
            //var image = new Image();
            //image.src = imageFullPath;
            //return imageFullPath;
            $scope.image.myImage = imageFullPath;
        };

        $scope.image = {};
        getImage();
        //$scope.image.myImage = getImage();
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

            //console.log($scope.image.myImage);
            //console.log($scope.image.myCroppedImage);
            //console.log(jpgDataUrlSrc);

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

    ctrl.$inject = ['$q', '$scope', '$ionicHistory', '$state', '$filter', 'DataService', 'HueService', 'UtilityService', 'HelperService'];
    return ctrl;

});
