/*global angular, define, console, window, navigator,cordova*/

define(function () {
    'use strict';

    function ctrl($ionicModal, $scope, $state, $filter, $interval, $ionicLoading, $ionicFilterBar, DataService, HueService, UtilityService, $q, DbService, PlaceholderDataUrl) {
        console.info("ScenesCtrl init");
        var filterBarInstance;
        $scope.selectedTab = 1;

        $scope.$on("$ionicView.beforeEnter", function () {
            refresh();
        });

        function getIndexOf(arr, val, prop) {
            var l = arr.length,
                k = 0;
            for (k = 0; k < l; k = k + 1) {
                if (arr[k][prop] === val) {
                    return k;
                }
            }
            return false;
        }

        $scope.getUrlSrc = function (imageId) {
            if (angular.isDefined($scope.allImages) && imageId in $scope.allImages) {
                return $scope.allImages[imageId];
            } else
                return PlaceholderDataUrl;
        };

        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allScenes,
                update: function (filteredItems) {
                    refreshGridView(filteredItems);
                },
                filterProperties: 'name'
            });
        };

        $scope.activateScene = function (sceneId) {
            HueService.recallScene(sceneId).then(function (data) {

            });
        };

        $scope.deleteScene = function (sceneId) {
            console.log(sceneId);

            function onConfirm(buttonIndex) {
                if (buttonIndex === 1) //delete
                {
                    HueService.deleteScene(sceneId).then(function (data) {
                        DataService.removeCustomScene(sceneId);
                        refresh();
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

        var refreshGridView = function (customScenes) {
            var ownCustomScenes = DataService.getCustomScenes();

            var rowSize = 2;
            var customScenesRows = [];

            var rowList = [];
            angular.forEach(customScenes, function (scene) {
                angular.forEach(ownCustomScenes, function (ownScene) {
                    if (ownScene.id === scene.id && angular.isDefined(ownScene.image)) {
                        scene.image = ownScene.image;
                    }
                });

                if (rowList.length === rowSize) {
                    customScenesRows.push(rowList);
                    rowList = [];
                }
                rowList.push(scene);
            });
            customScenesRows.push(rowList);
            $scope.customScenesRows = customScenesRows;
        };

        var refresh = function () {
            DbService.getAllImages()
                .then(function (images) {
                    var tmp = {};
                    angular.forEach(images, function (image) {
                        tmp[image.imageId] = image.imageData;
                    });
                    $scope.allImages = tmp;
                    console.log($scope.allImages);
                })
                .then(function () {

                    HueService.getAllScenes().then(function (data) {
                        var customScenes = [];
                        angular.forEach(data, function (value, key) {
                            value.id = key;
                            if (!value.name.match(/\soff\s\d+/g)) {
                                value.name = value.name.replace(/\son\s\d+/, '').replace(/\sfon\s\d+/, '');
                                customScenes.push(value);
                            }
                        });
                        $scope.allScenes = customScenes;
                        refreshGridView(customScenes);
                    });


                });

        };

        $ionicModal.fromTemplateUrl('scene-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.sceneModal = modal;
        });

        $scope.openEditSceneModal = function (scene) {
            console.log(scene);
            $scope.scene = scene;
            $scope.sceneModal.show();
        };
        $scope.closeModal = function () {
            $scope.sceneModal.hide();
        };
    }

    ctrl.$inject = ['$ionicModal', '$scope', '$state', '$filter', '$interval', '$ionicLoading', '$ionicFilterBar', 'DataService', 'HueService', 'UtilityService', '$q', 'DbService', 'PlaceholderDataUrl'];
    return ctrl;

});
