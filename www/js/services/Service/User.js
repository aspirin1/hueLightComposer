/*global define, console, navigator, cordova, window, Firebase */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($firebaseArray, $firebaseObject, FirebaseUrl, DataService) {
        var self = this;
        var authData = null,
            uid = null;

        var usersRef = new Firebase(FirebaseUrl + 'users');

        var getAuthData = function () {
            authData = DataService.getUserAuthData();
            if (authData === null)
                uid = "";
            else
                uid = authData.uid;
        };

        this.getUser = function () {
            if (authData === null)
                getAuthData();
            return $firebaseObject(usersRef.child(uid));
        };
        return this;
    };

    factory.$inject = ['$firebaseArray', '$firebaseObject', 'FirebaseUrl', 'DataService'];
    return factory;
});
