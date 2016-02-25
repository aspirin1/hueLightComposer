/*global define, console, navigator, cordova, window */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($firebaseAuth, FirebaseUrl) {
        var self = this;

        var usersRef = new Firebase(FirebaseUrl);
        return $firebaseAuth(usersRef);
    };

    factory.$inject = ['$firebaseAuth', 'FirebaseUrl'];
    return factory;
});
