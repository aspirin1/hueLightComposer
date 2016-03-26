/*global define, console, navigator, cordova, window, Firebase, FileReader */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($q, $firebaseArray, $firebaseObject, FirebaseUrl) {
        var self = this;
        var authData = null,
            uid = null;


        var getBase64FromImageUrl = function (imageUrl) {
            console.log(imageUrl, cordova.file.dataDirectory);
            var defer = $q.defer();
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory + imageUrl, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (evt) {
                            defer.resolve({
                                'imageUrl': imageUrl,
                                'image64': evt.target.result
                            });
                        };
                        reader.readAsDataURL(file);
                    }, fail);
                },
                fail);
            return defer.promise;
        };


        function fail(error) {
            console.error("fail: " + error.code, error);
        }


        var usersRef = new Firebase(FirebaseUrl + 'users');

        this.setUserAuthData = function (auth) {
            authData = auth;
            if (auth !== null)
                uid = auth.uid;
        };

        this.getUserAuthData = function () {
            return authData;
        };

        this.getUser = function () {
            return $firebaseObject(usersRef.child(uid));
        };

        this.getUserCustomColors = function () {
            return $firebaseObject(usersRef.child(uid).child('customColors'));
        };

        this.getUserCustomScenes = function () {
            return $firebaseObject(usersRef.child(uid).child('customScenes'));
        };

        this.getUserFavoriteColors = function () {
            return $firebaseObject(usersRef.child(uid).child('favoriteColors'));
        };

        this.getUserImages = function () {
            return $firebaseObject(usersRef.child(uid).child('images'));
        };

        this.getUserLanguage = function () {
            return $firebaseObject(usersRef.child(uid).child('language'));
        };

        this.getUserDesign = function () {
            return $firebaseObject(usersRef.child(uid).child('design'));
        };

        this.deleteUserImage = function (key) {
            if (authData === null)
                return;

            var images = self.getUserImages();
            images.$loaded().then(function () {
                delete images[key];
                images.$save();
            });
        };

        this.updateUserImage = function (key, value) {
            if (authData === null)
                return;

            var images = self.getUserImages();
            images.$loaded().then(function () {
                images[key] = value;
                images.$save();
            });
        };

        this.deleteCustomScene = function (uid) {
            if (authData === null)
                return;

            var scenes = self.getUserCustomScenes();
            scenes.$loaded().then(function () {
                var scene = scenes[uid];
                var imageWithoutFileExtension = scene.image.replace('.jpg', '');

                self.deleteUserImage(imageWithoutFileExtension);
                delete scenes[uid];
                scenes.$save();
            });
        };

        this.updateCustomScene = function (key, value) {
            if (authData === null)
                return;

            var scenes = self.getUserCustomScenes();
            scenes.$loaded().then(function () {
                scenes[key] = value;
                scenes.$save();
            });

            if (angular.isDefined(value.image) && value.image !== null) {
                getBase64FromImageUrl(value.image).then(function (data) {
                    var imageWithoutFileExtension = data.imageUrl.replace('.jpg', '');
                    var image = {
                        'imageUrl': data.imageUrl,
                        'image64': data.image64
                    };
                    self.updateUserImage(imageWithoutFileExtension, image);
                });
            }
        };

        this.deleteUserCustomColor = function (hexColor) {
            if (authData === null)
                return;

            var colors = self.getUserCustomColors();
            colors.$loaded().then(function () {
                angular.forEach(colors, function (value, key) {
                    if (key.charAt(0) !== '$' && value.hexColor === hexColor) {
                        delete colors[key];
                        colors.$save();
                        return;
                    }
                });
            });
        };

        this.updateUserCustomColor = function (key, value) {
            if (authData === null)
                return;

            var colors = self.getUserCustomColors();
            colors.$loaded().then(function () {
                colors[key] = value;
                colors.$save();
            });
        };

        this.deleteFavoriteColor = function (hexColorKey) {
            if (authData === null)
                return;

            var color = $firebaseObject(usersRef.child(uid).child('favoriteColors').child(hexColorKey));
            color.$loaded().then(function () {
                color.$remove();
            });
        };

        this.updateFavoriteColors = function (key, value) {
            if (authData === null)
                return;

            var colors = self.getUserFavoriteColors();
            colors.$loaded().then(function () {
                colors[key] = value;
                colors.$save();
            });
        };
        return this;
    };

    factory.$inject = ['$q', '$firebaseArray', '$firebaseObject', 'FirebaseUrl'];
    return factory;
});
