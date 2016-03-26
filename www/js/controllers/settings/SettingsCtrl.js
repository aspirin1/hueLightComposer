/*global define, console, window,localStorage,angular*/

define(function () {
    'use strict';

    function ctrl(HelperService, $scope, $state, $translate, ConfigService, ColorService, ColorDataService, User, DataService, localStorageService, UtilityService, $q, Synchronization) {

        $scope.selectedLanguage = $translate.use();
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

        $scope.selectedDesign = $scope.theme();
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

        $scope.isLoggedIn = function () {
            return DataService.isUserLoggedIn();
        };

        $scope.test = function () {
            var scenes = localStorageService.get('customScenes');
            angular.forEach(scenes, function (scene) {
                UtilityService.getBase64FromImageUrl(scene.image).then(function (data) {
                    console.log(data);
                });
                console.log(scene);
            });
        };

        var i = 100;
        $scope.write = function () {
            DataService.addCustomScene(i, "test" + i, [1], "testbild" + i + ".jpg");
            UtilityService.writeBase64ImageToFilesSystem("testbild" + i + ".jpg", "data:image/jpeg;base64,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");
            i++;
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
                        var imagePromise = UtilityService.getBase64FromImageUrl(scene.image).then(function (data) {
                            var imageWithoutFileExtension = data.imageUrl.replace('.jpg', '');
                            images[imageWithoutFileExtension] = {
                                'imageUrl': data.imageUrl,
                                'image64': data.image64
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
                    console.log("load", user);
                    ConfigService.setDesign(user.design.key);
                    ConfigService.setLanguage(user.language.key);
                    localStorageService.set('customScenes', user.customScenes);
                    localStorageService.set('customColors', user.customColors);
                    localStorageService.set('favoriteColors', user.favoriteColors);


                    angular.forEach(user.customScenes, function (scene) {
                        if (scene.image !== null) {
                            UtilityService.writeBase64ImageToFilesSystem(scene.image, user.images[scene.image.replace('.jpg', '')].image64);
                        }
                    });
                });
            }
        };

        $scope.reset = function () {
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
    }

    ctrl.$inject = ['HelperService', '$scope', '$state', '$translate', 'ConfigService', 'ColorService', 'ColorDataService', 'User', 'DataService', 'localStorageService', 'UtilityService', '$q', 'Synchronization'];
    return ctrl;

});
