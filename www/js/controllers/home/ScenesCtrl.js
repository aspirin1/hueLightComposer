/*global angular, define, console, window, navigator,cordova*/

define(function () {
    'use strict';

    function ctrl($ionicModal, $scope, $state, $filter, $interval, $ionicLoading, $ionicFilterBar, DataService, HueService, UtilityService, $q, DbService, PlaceholderDataUrl) {
        console.info("ScenesCtrl init");
        var filterBarInstance;
        $scope.selectedTab = 1;

        $scope.$on("$ionicView.beforeEnter", function () {
            $scope.refresh();
        });


        var animateCss = function (selector, animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            angular.element(selector).find("span,div").hide();
            angular.element(selector).addClass('animated ' + animationName).one(animationEnd, function () {
                angular.element(selector).find("span,div").show();
                angular.element(selector).removeClass('animated ' + animationName);
            });
        };

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
                //todo css flash effect
                animateCss('#sceneId' + sceneId, 'pulse');
            });
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

        $scope.refresh = function () {
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

        $ionicModal.fromTemplateUrl('templates/home/modals/sceneModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.sceneModal = modal;
        });

        $scope.openEditSceneModal = function (scene) {
            $scope.scene = scene;
            $scope.sceneModal.show();
        };

    }

    ctrl.$inject = ['$ionicModal', '$scope', '$state', '$filter', '$interval', '$ionicLoading', '$ionicFilterBar', 'DataService', 'HueService', 'UtilityService', '$q', 'DbService', 'PlaceholderDataUrl'];
    return ctrl;

});
