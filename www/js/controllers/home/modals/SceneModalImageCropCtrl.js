/*global angular, define, console, window, navigator, document, Hammer, Cropper*/

define(function () {
    'use strict';

    function ctrl(HueService, $scope, DataService, $filter, PlaceholderDataUrl) {
        console.info("SceneModalCtrl init");

        $scope.$on('modal.shown', function (event, modal) {
            if (modal.id === 'sceneModalImageCrop') {
                console.log("image crop shown");
                initImageCropping();
                initPinchEvent();
            }
        });

        var initImageCropping = function () {
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

        var initPinchEvent = function () {
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
        };

        $scope.closeImageCropModal = function () {
            $scope.sceneModalImageCrop.remove();
        };

        $scope.saveImage = function () {
            var jpgDataUrlSrc = $scope.cropper.getCroppedCanvas({
                width: 400,
                height: 400
            }).toDataURL('image/jpeg');

            DataService.setSceneImageCropped(jpgDataUrlSrc);
            $scope.closeImageCropModal();
        };

    }

    ctrl.$inject = ['HueService', '$scope', 'DataService', '$filter', 'PlaceholderDataUrl'];
    return ctrl;

});