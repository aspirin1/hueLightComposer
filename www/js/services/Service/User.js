/*global define, console, navigator, cordova, window, Firebase */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($firebaseArray, $firebaseObject, FirebaseUrl) {
        var self = this;
        var authData = null,
            uid = null;

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

        this.deleteFavoriteColor = function (hexColorKey) {
            console.log(authData, usersRef, hexColorKey)
            var color = $firebaseObject(usersRef.child(uid).child('favoriteColors').child(hexColorKey));
            color.$loaded().then(function () {
                color.$remove();
            });
        };

        this.updateFavoriteColors = function (favoriteColors) {
            console.log(authData, usersRef, favoriteColors)
            var user = self.getUser();
            user.$loaded().then(function () {
                user.favoriteColors = favoriteColors;
                user.$save();
            });
        };
        return this;
    };

    factory.$inject = ['$firebaseArray', '$firebaseObject', 'FirebaseUrl'];
    return factory;
});
