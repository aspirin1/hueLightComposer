/*global angular, define, console, window, navigator*/

define(function () {
    'use strict';

    function ctrl(HueService, $scope, DataService, $filter, PlaceholderDataUrl, $ionicModal, UtilityService, $state) {


 var refreshLights=function(){
        DataService.getEnrichedLightInfos(true).then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.lights = tmp;
        });
 };

        $scope.$on('modal.shown', function (event, modal) {
            if (modal.id === "sceneModal") {
                refreshLights();

                DataService.setSceneImageCropped(null);
                DataService.setSceneImage(null);

                $scope.isEditMode = (angular.isDefined($scope.scene) && $scope.scene !== null);
                if ($scope.isEditMode) {

                }
                $scope.titleText = getTitleText();
                $scope.saveText = getSaveText();
                $scope.showCropButton = false;
                $scope.modalScene = {};
                $scope.modalScene.previewImage = getScenePreviewImage();
                $scope.modalScene.name = getName();
                $scope.modalScene.selectedLights = getSelectedLights();
            }
        });

        $scope.$on('modal.removed', function (event, modal) {
            if (modal.id === "sceneModalImageCrop") {
                if (isCroppedImageAvailable()) {
                    $scope.showCropButton = true;
                    $scope.modalScene.previewImage = DataService.getSceneImageCropped();
                }
            }
        });

        var isCroppedImageAvailable = function () {
            var croppedImageUrl = DataService.getSceneImageCropped();
            return croppedImageUrl !== null;
        };

        var getSelectedLights = function () {
            if (!$scope.isEditMode) {
                return {};
            }
            var tmp = {};
            angular.forEach($scope.scene.lights, function (lightId) {
                tmp[lightId] = true;
            });
            return tmp;
        };

        var getName = function () {
            if ($scope.isEditMode) {
                return $scope.scene.name;
            }
            return "";
        };

        var getTitleText = function () {
            if ($scope.isEditMode) {
                return $scope.scene.name;
            } else {
                return $filter('translate')('Home_LightList_CreateScene');
            }
        };

        var getSaveText = function () {
            if ($scope.isEditMode) {
                return $filter('translate')('SINGLE_Update');
            } else {
                return $filter('translate')('SINGLE_Create');
            }
        };

        var getScenePreviewImage = function () {
            if ($scope.isEditMode) {
                if (angular.isDefined($scope.allImages) &&
                    angular.isDefined($scope.scene.image) &&
                    $scope.scene.image !== null &&
                    $scope.scene.image in $scope.allImages) {
                    return $scope.allImages[$scope.scene.image];
                }
            }
            return PlaceholderDataUrl;
        };

        $scope.closeModal = function () {
            $scope.sceneModal.hide();
        };

        $scope.deleteScene = function (sceneId) {


            function onConfirm(buttonIndex) {
                if (buttonIndex === 1) //delete
                {
                    HueService.deleteScene(sceneId).then(function (data) {
                        DataService.removeCustomScene(sceneId);
                        $scope.refresh();
                        $scope.closeModal();
                    });
                }
            }

            navigator.notification.confirm(
                'Do you really want to delete the scene "' + $scope.scene.name + '"?', // message
                onConfirm, // callback to invoke with index of button pressed
                'Delete', // title
                    ['Delete', 'Cancel'] // buttonLabels
            );
        };

        var validateForm = function (tmp) {
            if (tmp.length === 0) {
                navigator.notification.alert($filter('translate')('Select_At_Least_1_Light'), null, $filter('translate')('ERROR_TITLE'));
            } else if ($scope.modalScene.name.length === 0) {
                navigator.notification.alert($filter('translate')('Enter_Name'), null, $filter('translate')('ERROR_TITLE'));
            } else if ($scope.modalScene.name.length > 32) {
                navigator.notification.alert($filter('translate')('Name_Too_Long'), null, $filter('translate')('ERROR_TITLE'));
            }
        };

        var getLightSelection = function () {
            var tmp = [];

            angular.forEach($scope.modalScene.selectedLights, function (value, key) {
                if (value === true) {
                    tmp.push(key);
                }
            });
            return tmp;
        };

        var afterModifyScene = function (tmp, data) {


            if (isCroppedImageAvailable()) {
                DataService.removeCustomScene($scope.scene.id);
                DataService.addCustomScene($scope.scene.id, $scope.modalScene.name, tmp, DataService.getSceneImageCropped());
            }
            $scope.closeModal();
            if (angular.isDefined($scope.refresh)) {
                $scope.refresh();
            }
            $state.go('main.home_tab.scenes');
        };

        $scope.updateWithLightstate = function () {
            var tmp = getLightSelection();
            validateForm(tmp);

            if (tmp.length > 0 && $scope.modalScene.name.length > 0 && $scope.modalScene.name.length <= 32) {
                if ($scope.isEditMode) {
                    HueService.modifyScene($scope.scene.id, $scope.modalScene.name, tmp, true).then(function (data) {
                        afterModifyScene(tmp, data);
                    });
                }
            }
        };

        $scope.createOrUpdateScene = function () {
            var tmp = getLightSelection();
            validateForm(tmp);

            if (tmp.length > 0 && $scope.modalScene.name.length > 0 && $scope.modalScene.name.length <= 32) {
                if ($scope.isEditMode) {
                    HueService.modifyScene($scope.scene.id, $scope.modalScene.name, tmp, false).then(function (data) {
                        afterModifyScene(tmp, data);
                    });
                } else {
                    HueService.createScene($scope.modalScene.name, tmp).then(function (data) {

                        DataService.addCustomScene(data[0].success.id, $scope.modalScene.name, tmp, DataService.getSceneImageCropped());
                        $scope.closeModal();
                        if (angular.isDefined($scope.refresh)) {
                            $scope.refresh();
                        }
                        $state.go('main.home_tab.scenes');
                    });
                }
            }
        };

        $scope.openSceneModalImageCrop = function () {
            $ionicModal.fromTemplateUrl('templates/home/modals/sceneModalImageCrop.html', {
                id: 'sceneModalImageCrop',
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.sceneModalImageCrop = modal;
                $scope.sceneModalImageCrop.show();
            });
        };

        $scope.scenePictureAlbum = function () {
            UtilityService.getPictureAlbumAsDataUrl().then(function (data) {
                DataService.setSceneImage(data);
                $scope.openSceneModalImageCrop();
            });
        };

        $scope.scenePictureCamera = function () {
            UtilityService.getPictureCameraAsDataUrl().then(function (data) {
                DataService.setSceneImage(data);
                $scope.openSceneModalImageCrop();
            });
        };
    }

    ctrl.$inject = ['HueService', '$scope', 'DataService', '$filter', 'PlaceholderDataUrl', '$ionicModal', 'UtilityService', '$state'];
    return ctrl;

});
