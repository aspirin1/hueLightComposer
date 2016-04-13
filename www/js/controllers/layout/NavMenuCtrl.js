/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $ionicSideMenuDelegate, Auth, User, Synchronization) {
        $scope.authData = null;

        $scope.toggleLeftSideMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.login = function (authMethod) {
            //Auth.$authWithOAuthRedirect(authMethod).then(function (authData) {}).catch(function (error) {
            Auth.$authWithOAuthPopup(authMethod).then(function (authData) {
                console.info(authData);
            }).catch(function (error) {
                if (error.code === 'TRANSPORT_UNAVAILABLE') {
                    Auth.$authWithOAuthPopup(authMethod).then(function (authData) {});
                } else {
                    console.log(error);
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
            console.log("test");

            var user = User.getUser();
            $scope.user = user;
            user.$loaded().then(function (data) {
                console.log("loaded record:", user.$id, user.someOtherKeyInData);

                // To iterate the key/value pairs of the object, use angular.forEach()
                angular.forEach(user, function (value, key) {
                    console.log(key, value);
                });
            });

        };

        Auth.$onAuth(function (authData) {
            if (authData === null) {
                console.log('Not logged in yet');
            } else {
                console.log(authData);
                console.log('Logged in as', authData.uid);
                Synchronization.start();
            }
            // This will display the user's name in our view
            User.setUserAuthData(authData);

        });
    }

    ctrl.$inject = ['$scope', '$state', '$ionicSideMenuDelegate', 'Auth', 'User', 'Synchronization'];
    return ctrl;

});