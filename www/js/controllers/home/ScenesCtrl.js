/*global angular, define, console, window, navigator,cordova*/

define(function () {
    'use strict';

    function ctrl($filter, $ionicModal, $scope, $ionicFilterBar, DataService, HueService, DbService, PlaceholderDataUrl, $q, ConfigService) {

        var filterBarInstance;
        $scope.selectedTab = 1;
        $scope.activeCategory = "always";

        $scope.$on("$ionicView.beforeEnter", function () {
            $scope.refresh();
        });

        function refreshActiveCategory() {
            var beginNightTimeDateObj = ConfigService.getBeginNight();
            var now = new Date();
            if (beginNightTimeDateObj > now) {
                $scope.activeCategory = "day";
            } else {
                $scope.activeCategory = "night";
            }
        }

        var animateCss = function (selector, animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            angular.element(selector).find("span,div").hide();
            angular.element(selector).addClass('animated ' + animationName).one(animationEnd, function () {
                angular.element(selector).find("span,div").show();
                angular.element(selector).removeClass('animated ' + animationName);
            });
        };

        $scope.changeSceneFilteringByCategory = function () {
            if ($scope.activeCategory === "always") {
                $scope.activeCategory = "day";
            } else if ($scope.activeCategory === "day") {
                $scope.activeCategory = "night";
            } else if ($scope.activeCategory === "night") {
                $scope.activeCategory = "always";
            }
            refreshGridView($scope.allScenes);
        };

        $scope.getCategoryClass = function () {
            if ($scope.activeCategory === "always") {
                return "ion-ios-infinite";
            } else if ($scope.activeCategory === "day") {
                return "ion-ios-partlysunny-outline";
            } else if ($scope.activeCategory === "night") {
                return "ion-ios-cloudy-night-outline";
            }
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

                window.setTimeout(refreshLightsAndLookForActiveScenes, 1000);
            });
        };

        var refreshGridView = function (customScenes) {
            var ownCustomScenes = DataService.getCustomScenes();

            var rowSize = 2;
            var customScenesRows = [];

            var rowList = [];

            angular.forEach(customScenes, function (scene) {
                angular.forEach(ownCustomScenes, function (ownScene) {
                    if (ownScene.id === scene.id) {
                        if (angular.isDefined(ownScene.image)) {
                            scene.image = ownScene.image;
                        }
                        if (angular.isDefined(ownScene.category)) {
                            scene.category = ownScene.category;
                        }
                    }
                });
            });

            customScenes = $filter('filter')(customScenes, {
                category: $scope.activeCategory
            }, true);

            angular.forEach(customScenes, function (scene) {
                if (rowList.length === rowSize) {
                    customScenesRows.push(rowList);
                    rowList = [];
                }
                rowList.push(scene);
            });
            customScenesRows.push(rowList);
            $scope.customScenesRows = customScenesRows;
        };

        var findActiveScenes = function () {
            var promises = [];
            var sceneDetails = {};
            angular.forEach($scope.allScenes, function (scene) {
                var promise = HueService.getScene(scene.id).then(function (data) {
                    data.id = scene.id;
                    sceneDetails[scene.id] = data;
                });
                promises.push(promise);
            });
            $q.all(promises).then(function () {

                $scope.sceneDetails = sceneDetails;
                checkIfSceneIsActive();
            });
        };

        var checkIfSceneIsActive = function () {
            //$scope.lightsById //obj by light id
            //$scope.sceneDetails   //obj by scene id

            angular.forEach($scope.allScenes, function (scene) {
                var sceneDetail = $scope.sceneDetails[scene.id];
                var isActive = (Object.keys(sceneDetail.lightstates).length > 0);
                angular.forEach(sceneDetail.lightstates, function (lightstate, lightId) {
                    if (isActive === false) {
                        return;
                    }
                    var currentLightState = $scope.lightsById[lightId];


                    angular.forEach(lightstate, function (propertyValue, propertyName) {
                        var state = currentLightState.state[propertyName];
                        if (propertyName === "xy") {
                            state[0] = parseFloat(state[0]).toFixed(1).toString();
                            state[1] = parseFloat(state[1]).toFixed(1).toString();
                            propertyValue[0] = parseFloat(propertyValue[0]).toFixed(1).toString();
                            propertyValue[1] = parseFloat(propertyValue[1]).toFixed(1).toString();

                            isActive = isActive && (propertyValue[0] === state[0] && propertyValue[1] === state[1]);
                        } else if (propertyName === "ct") {
                            var ctState = parseInt(state);
                            var ctPropertyValue = propertyValue;
                            var diff = Math.abs(ctState - ctPropertyValue);

                            isActive = isActive && (diff <= 5);
                        } else {

                            isActive = isActive && (propertyValue === state);
                        }
                    });
                });



                scene.isActive = isActive;
            });
            refreshGridView($scope.allScenes);
        };

        var refreshLights = function () {
            DataService.getEnrichedLightInfos(true).then(function (data) {
                $scope.lightsById = data;
            });
        };

        var refreshLightsAndLookForActiveScenes = function () {
            DataService.getEnrichedLightInfos(true).then(function (data) {
                $scope.lightsById = data;
                findActiveScenes();
            });
        };

        $scope.refresh = function () {
            refreshActiveCategory();
            refreshLights();

            DbService.getAllImages()
                .then(function (images) {
                    var tmp = {};
                    angular.forEach(images, function (image) {
                        tmp[image.imageId] = image.imageData;
                    });
                    $scope.allImages = tmp;

                })
                .then(function () {

                    HueService.getAllScenes().then(function (data) {
                        var customScenes = [];
                        angular.forEach(data, function (value, key) {
                            value.id = key;
                            value.isActive = false;
                            value.category = "always";
                            if (!value.name.match(/\soff\s\d+/g)) {
                                value.name = value.name.replace(/\son\s\d+/, '').replace(/\sfon\s\d+/, '');
                                customScenes.push(value);
                            }
                        });

                        customScenes = $filter('orderBy')(customScenes, "name");

                        $scope.allScenes = customScenes;
                        refreshGridView(customScenes);
                        findActiveScenes();
                    });


                });
        };

        $ionicModal.fromTemplateUrl('templates/home/modals/sceneModal.html', {
            id: 'sceneModal',
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

    ctrl.$inject = ['$filter', '$ionicModal', '$scope', '$ionicFilterBar', 'DataService', 'HueService', 'DbService', 'PlaceholderDataUrl', '$q', 'ConfigService'];
    return ctrl;

});