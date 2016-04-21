/*global angular, define, console, window, navigator,cordova,document, Image,XMLHttpRequest,Cropper,Hammer*/

define(function () {
    'use strict';

    function ctrl($q, $scope, $ionicHistory, $state, $filter, DataService, HueService, UtilityService, HelperService) {
        console.info("NewSceneImageCtrl init");

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
            //console.log("isLast", ev)
            var val = parseInt(widthHeight * ev.scale);
            var data2 = $scope.cropper.getData();
            data2.width = val;
            data2.height = val;
            $scope.cropper.setData(data2);
        });
        //        mc.on("pinch", function (ev) {
        //            ev.preventDefault();
        //            if (ev.isFirst) {
        //                console.log("first", ev)
        //                var data = $scope.cropper.getData();
        //                widthHeight = data.width;
        //            }
        //            if (ev.isLast) {
        //                console.log("isLast", ev)
        //                var val = widthHeight * scale;
        //                var data2 = $scope.cropper.getData();
        //                data2.width = val;
        //                data2.height = val;
        //                $scope.cropper.setData(data2);
        //            }
        //
        //            if (ev.deltaTime < lastDeltaTime) {
        //                lastDeltaTime = 0;
        //            }
        //
        //            //            if ((ev.deltaTime - lastDeltaTime) > 50) {
        //            //                console.log(ev)
        //            //
        //            //
        //            //                data.width = data.width - ev.deltaY;
        //            //                data.height = data.width;
        //            //
        //            //                //var offset = parseInt(data.width / 2);
        //            //                //data.x = ev.center.x - offset;
        //            //                //data.y = ev.center.y - offset;
        //            //
        //            //                lastDeltaTime = ev.deltaTime;
        //            //                $scope.cropper.setData(data);
        //            //            }
        //
        //        });


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
