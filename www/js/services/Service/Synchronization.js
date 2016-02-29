/*global define, console, navigator, cordova, window */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (User, localStorageService) {
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

        var favoriteColorsChanged = function () {
            console.log("FavoriteColors changed", this, arguments);

            var remote_favoriteColors = User.getUserFavoriteColors();
            remote_favoriteColors.$loaded().then(function () {
                var local_favoriteColors = localStorageService.get('favoriteColors');
                console.info(remote_favoriteColors);

                var updateLocalFromServer = function () {
                    console.log("update local from server");
                    var tmp = {};
                    angular.forEach(remote_favoriteColors, function (value, key) {
                        if (key.charAt(0) !== '$')
                            tmp[key] = value;
                    });
                    localStorageService.set('favoriteColors', tmp);
                };

                //no local data exists try loading from remote
                if (angular.isUndefined(local_favoriteColors) || local_favoriteColors === null) {
                    updateLocalFromServer();
                }
                //initial post to server
                else if (angular.isDefined(remote_favoriteColors.$value) && remote_favoriteColors.$value === null) {
                    angular.forEach(local_favoriteColors, function (value, key) {
                        remote_favoriteColors[key] = value;
                    });
                    remote_favoriteColors.$save();
                } else {
                    if (Object.keys(local_favoriteColors).length > 0) {
                        var latestLocal = getLatestChangedAtObj(local_favoriteColors);
                        var latestRemote = getLatestChangedAtObj(remote_favoriteColors);
                        console.log(latestLocal, latestRemote);

                        if (latestLocal > latestRemote) //new entry exists locally
                        {
                            console.log("push data to server");
                            angular.forEach(local_favoriteColors, function (value, key) {
                                remote_favoriteColors[key] = value;
                            });
                            remote_favoriteColors.$save();
                        } else if (latestRemote > latestLocal) //new entry exists remote
                        {

                            updateLocalFromServer();
                        }
                    }
                }

            });
        };

        var customColorsChanged = function () {
            console.log("CustomColors changed", this, arguments);

            User.getUserCustomColors().$loaded().then(function (remote_customColors) {
                var local_customColors = localStorageService.get('customColors');

                if (local_customColors.length !== remote_customColors.length ||
                    getLatestChangedAtList(remote_customColors) > getLatestChangedAtList(local_customColors)
                ) {
                    localStorageService.set('customColors', remote_customColors);
                }
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
            //User.getUserCustomColors().$watch(customColorsChanged);
        };

        return this;
    };

    factory.$inject = ['User', 'localStorageService'];
    return factory;
});
