/*global angular, define, console, window, navigator,cordova,document, Image,XMLHttpRequest,Cropper*/

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
            console.log(imageData);
            $scope.image.myImage = "data:image/jpeg;base64," + imageData;
        };


        var refresh = function () {
            console.log("refresh");
            $scope.image = {};
            $scope.image.myCroppedImage = '';
            //$scope.image.myImage = "data:image/jpeg;base64," + DataService.getSceneImage();

            var image = document.getElementById('imageToCrop');
            image.setAttribute('crossOrigin', 'anonymous');
            image.onload = function () {
                console.log("image loaded");
                $scope.cropper = new Cropper(image, {
                    viewMode: 3,
                    dragMode: 'move',
                    aspectRatio: 1 / 1,
                    zoomable: false,
                    toggleDragModeOnDblclick: false,
                    minCropBoxWidth: 100,
                    minCropBoxHeight: 100,
                    //                    crop: function (e) {
                    //                        console.log(e.detail.x);
                    //                        console.log(e.detail.y);
                    //                        console.log(e.detail.width);
                    //                        console.log(e.detail.height);
                    //                        console.log(e.detail.rotate);
                    //                        console.log(e.detail.scaleX);
                    //                        console.log(e.detail.scaleY);
                    //                    }
                });

            };
            image.src = "data:image/jpeg;base64," + DataService.getSceneImage();
        };

        $scope.reset = function () {
            $scope.cropper.reset();
        };

        $scope.saveImage = function () {
            //            var canvas = document.getElementById("canvas");
            //            canvas.width = 400;
            //            canvas.height = 400;
            //
            //            var image = new Image();
            //            image.src = $scope.image.myCroppedImage;
            //            canvas.getContext("2d").drawImage(image, 0, 0);
            //            var jpgDataUrlSrc = canvas.toDataURL("image/jpeg");

            var jpgDataUrlSrc = $scope.cropper.getCroppedCanvas({
                width: 400,
                height: 400
            }).toDataURL('image/jpeg');
            console.log(jpgDataUrlSrc);

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
