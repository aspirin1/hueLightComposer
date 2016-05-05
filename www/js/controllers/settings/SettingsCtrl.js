/*global define, console, window,localStorage,angular*/

define(function () {
    'use strict';

    function ctrl($scope, $translate, ConfigService, User, DataService, localStorageService, $q, Synchronization, DbService) {

        $scope.$on("$ionicView.beforeEnter", function () {
            $scope.beginNight = {
                value: ConfigService.getBeginNight()
            };
            $scope.selectedLanguage = $translate.use();
            $scope.selectedDesign = $scope.theme();
            $scope.isLoggedIn = function () {
                return DataService.isUserLoggedIn();
            };
        });

        $scope.beginNightChanged = function () {
            ConfigService.setBeginNight($scope.beginNight.value);
        }

        $scope.languageChanged = function (key) {
            ConfigService.setLanguage(key);
            $translate.use(key);

            if (DataService.isUserLoggedIn()) {
                var user = User.getUser();
                user.$loaded().then(function () {
                    user.language = ConfigService.getLanguage();
                    user.$save();
                });
            }
        };

        $scope.designChanged = function (key) {
            ConfigService.setDesign(key);

            if (DataService.isUserLoggedIn()) {
                var user = User.getUser();
                user.$loaded().then(function () {
                    user.design = ConfigService.getDesign();
                    user.$save();
                });
            }
        };

        $scope.saveToCloud = function () {
            if (DataService.isUserLoggedIn()) {
                var scenes = localStorageService.get('customScenes');

                var user = User.getUser();

                user.design = ConfigService.getDesign();
                user.language = ConfigService.getLanguage();
                user.customScenes = scenes;
                user.customColors = localStorageService.get('customColors');
                user.favoriteColors = localStorageService.get('favoriteColors');


                var images = {};
                var imagePromises = [];
                angular.forEach(scenes, function (scene) {
                    if (scene.image !== null) {
                        var imagePromise = DbService.getImageByImageId(scene.image).then(function (data) {
                            images[data.imageId] = {
                                'imageId': data.imageId,
                                'image64': data.imageData
                            };
                        });
                        imagePromises.push(imagePromise);
                    }
                });
                $q.all(imagePromises).then(function () {
                    user.images = images;
                    user.$save();
                });

                user.$save();
            }
        };

        $scope.loadFromCloud = function () {
            if (DataService.isUserLoggedIn()) {
                var user = User.getUser();
                user.$loaded().then(function () {

                    ConfigService.setDesign(user.design.key);
                    ConfigService.setLanguage(user.language.key);
                    localStorageService.set('customScenes', user.customScenes);
                    localStorageService.set('customColors', user.customColors);
                    localStorageService.set('favoriteColors', user.favoriteColors);


                    angular.forEach(user.customScenes, function (scene) {
                        if (scene.image !== null) {
                            DbService.insertOrUpdateImage(scene.image, user.images[scene.image].image64);
                        }
                    });
                });
            }
        };

        $scope.reset = function () {
            DbService.dropTablesAndRecreateSchema();
            localStorage.clear();
            //localStorage.removeItem("ls.language");
            //localStorage.removeItem("ls.design");
            //localStorage.removeItem("ls.customScenes");
            //localStorage.removeItem("ls.customColors");
            //localStorage.removeItem("ls.favoriteColors");
        };

        $scope.sync = function () {
            Synchronization.doSync();
        };

        $scope.test = function () {
            console.log($scope.beginNight);
        }
    }

    ctrl.$inject = ['$scope', '$translate', 'ConfigService', 'User', 'DataService', 'localStorageService', '$q', 'Synchronization', 'DbService'];
    return ctrl;

});