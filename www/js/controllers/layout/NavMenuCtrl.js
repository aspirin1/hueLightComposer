/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $ionicSideMenuDelegate, Auth, User, Synchronization) {
        $scope.authData = null;

        $scope.toggleLeftSideMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.login = function (authMethod) {
            //Auth.$authWithOAuthRedirect(authMethod).then(function (authData) {}).catch(function (error) {
            Auth.$authWithOAuthPopup(authMethod).then(function (authData) {

            }).catch(function (error) {
                if (error.code === 'TRANSPORT_UNAVAILABLE') {
                    Auth.$authWithOAuthPopup(authMethod).then(function (authData) {});
                } else {

                }
            });
        };

        $scope.logout = function () {
            Auth.$unauth();
        };

        $scope.isLoggedIn = function () {
            return (User.getUserAuthData() !== null);
        };

        $scope.abc = function () {


            var user = User.getUser();
            $scope.user = user;
            user.$loaded().then(function (data) {


                // To iterate the key/value pairs of the object, use angular.forEach()
                angular.forEach(user, function (value, key) {

                });
            });

        };

        Auth.$onAuth(function (authData) {
            if (authData === null) {

            } else {


                Synchronization.start();
            }
            // This will display the user's name in our view
            User.setUserAuthData(authData);

        });
    }

    ctrl.$inject = ['$scope', '$ionicSideMenuDelegate', 'Auth', 'User', 'Synchronization'];
    return ctrl;

});
