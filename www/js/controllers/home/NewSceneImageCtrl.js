/*global angular, define, console, window, navigator,cordova,document, Image,XMLHttpRequest,Cropper,Hammer*/

define(function () {
    'use strict';

    function ctrl($q, $scope, $ionicHistory, DataService) {


        $scope.$on("$ionicView.beforeEnter", function () {
            refresh();
        });



        var myElement = document.getElementById('pinchContainer');
        var mc = new Hammer.Manager(myElement);
        var pinch = new Hammer.Pinch();
        mc.add([pinch]);
        var lastDeltaTime = 0;
        var widthHeight = 0;
        mc.on("pinchstart", function (ev) {
            ev.preventDefault();
            var data = $scope.cropper.getData();
            widthHeight = data.width;
        });
        mc.on("pinchmove", function (ev) {
            ev.preventDefault();
            var val = parseInt(widthHeight * ev.scale);
            var data2 = $scope.cropper.getData();
            data2.width = val;
            data2.height = val;
            $scope.cropper.setData(data2);
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


        var refresh = function () {

            $scope.image = {};
            $scope.image.myCroppedImage = '';
            //$scope.image.myImage = "data:image/jpeg;base64," + DataService.getSceneImage();

            var image = document.getElementById('imageToCrop');
            image.setAttribute('crossOrigin', 'anonymous');
            image.onload = function () {

                $scope.cropper = new Cropper(image, {
                    viewMode: 3,
                    dragMode: 'move',
                    aspectRatio: 1 / 1,
                    zoomable: false,
                    toggleDragModeOnDblclick: false,
                    minCropBoxWidth: 100,
                    minCropBoxHeight: 100,
                });

            };
            image.src = "data:image/jpeg;base64," + DataService.getSceneImage();
        };

        $scope.reset = function () {
            $scope.cropper.reset();
        };

        $scope.saveImage = function () {
            var jpgDataUrlSrc = $scope.cropper.getCroppedCanvas({
                width: 400,
                height: 400
            }).toDataURL('image/jpeg');


            DataService.setSceneImageCropped(jpgDataUrlSrc);
            $scope.back();
        };

        $scope.back = function () {
            $ionicHistory.goBack();
        };
    }

    ctrl.$inject = ['$q', '$scope', '$ionicHistory', 'DataService'];
    return ctrl;

});
