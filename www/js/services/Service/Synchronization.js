/*global define, console, navigator, cordova, window */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (User, localStorageService, UtilityService, $q) {
        var self = this;

        var getLatestChangedAtObj = function (obj) {
            var latestChangedAt = null;
            angular.forEach(obj, function (value, key) {
                if (key.charAt(0) !== '$' && (latestChangedAt === null || value.changedAt > latestChangedAt))
                    latestChangedAt = value.changedAt;
            });
            return latestChangedAt;
        };

        var getLatestChangedAtList = function (list) {
            var latestChangedAt = null;
            angular.forEach(list, function (value) {
                if (latestChangedAt === null || value.changedAt > latestChangedAt)
                    latestChangedAt = value.changedAt;
            });
            return latestChangedAt;
        };

        var doSynchroJob = function (remote_favoriteColors, lsKey) {
            var local_favoriteColors = localStorageService.get(lsKey);
            console.info(remote_favoriteColors);

            var updateLocalFromServer = function () {
                console.log("update local from server");
                var tmp = {};
                angular.forEach(remote_favoriteColors, function (value, key) {
                    if (key.charAt(0) !== '$')
                        tmp[key] = value;
                });
                localStorageService.set(lsKey, tmp);

                if (lsKey === "customScenes") {
                    var remote_userImages = User.getUserImages();
                    remote_userImages.$loaded().then(function () {
                        angular.forEach(tmp, function (scene) {
                            if (scene.image !== null) {
                                UtilityService.writeBase64ImageToFilesSystem(scene.image, remote_userImages[scene.image.replace('.jpg', '')].image64);
                            }
                        });
                    });
                }
            };

            var pushToServer = function () {
                angular.forEach(local_favoriteColors, function (value, key) {
                    remote_favoriteColors[key] = value;
                });
                remote_favoriteColors.$save();

                if (lsKey === "customScenes") {
                    var images = {};
                    var imagePromises = [];
                    angular.forEach(remote_favoriteColors, function (scene) {
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
                    var user = User.getUser();
                    $q.all(imagePromises).then(function () {
                        user.images = images;
                        user.$save();
                    });
                }
            };

            //no local data exists try loading from remote
            if (angular.isUndefined(local_favoriteColors) || local_favoriteColors === null) {
                updateLocalFromServer();
            }
            //initial post to server
            else if (angular.isDefined(remote_favoriteColors.$value) && remote_favoriteColors.$value === null) {
                pushToServer();
            } else {
                if (Object.keys(local_favoriteColors).length > 0) {
                    var latestLocal = getLatestChangedAtObj(local_favoriteColors);
                    var latestRemote = getLatestChangedAtObj(remote_favoriteColors);
                    console.log(latestLocal, latestRemote);

                    if (latestLocal > latestRemote) //new entry exists locally
                    {
                        pushToServer();
                        //                        console.log("push data to server");
                        //                        angular.forEach(local_favoriteColors, function (value, key) {
                        //                            remote_favoriteColors[key] = value;
                        //                        });
                        //                        remote_favoriteColors.$save();
                    } else if (latestRemote > latestLocal) //new entry exists remote
                    {
                        updateLocalFromServer();
                    }
                }
            }
        };

        var favoriteColorsChanged = function () {
            console.log("FavoriteColors changed", this, arguments);

            var remote_favoriteColors = User.getUserFavoriteColors();
            remote_favoriteColors.$loaded().then(function () {
                doSynchroJob(remote_favoriteColors, 'favoriteColors');
            });
        };

        var customColorsChanged = function () {
            console.log("CustomColors changed", this, arguments);

            var remote_favoriteColors = User.getUserCustomColors();
            remote_favoriteColors.$loaded().then(function () {
                doSynchroJob(remote_favoriteColors, 'customColors');
            });
        };

        var customScenesChanged = function () {
            console.log("CustomScenes changed", this, arguments);

            var remote_favoriteColors = User.getUserCustomScenes();
            remote_favoriteColors.$loaded().then(function () {
                doSynchroJob(remote_favoriteColors, 'customScenes');
            });
        };

        this.isUserLoggedIn = function () {
            return User.getUserAuthData() !== null;
        };

        this.start = function () {
            if (!self.isUserLoggedIn()) {
                return;
            }
            var user = User.getUser();
            user.$loaded().then(function () {
                console.log(user);
            });

            User.getUserFavoriteColors().$watch(favoriteColorsChanged);
            User.getUserCustomColors().$watch(customColorsChanged);
            User.getUserCustomScenes().$watch(customScenesChanged);
        };

        return this;
    };

    factory.$inject = ['User', 'localStorageService', 'UtilityService', '$q'];
    return factory;
});
