/*global define, console, window,localStorage,angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $translate, ConfigService, ColorService, ColorDataService, User, DataService, localStorageService) {

        $scope.selectedLanguage = $translate.use();
        $scope.languageChanged = function (key) {
            ConfigService.setLanguage(key);
            $translate.use(key);

            //            if (DataService.isUserLoggedIn()) {
            //                var user = User.getUser();
            //                user.language = key;
            //                user.$save();
            //            }
        };

        $scope.selectedDesign = $scope.theme();
        $scope.designChanged = function (key) {
            ConfigService.setDesign(key);

            //            if (DataService.isUserLoggedIn()) {
            //                var user = User.getUser();
            //                user.design = key;
            //                user.$save();
            //            }
        };


        $scope.isLoggedIn = function () {
            return DataService.isUserLoggedIn();
        };

        $scope.saveToCloud = function () {
            if (DataService.isUserLoggedIn()) {
                var user = User.getUser();
                user.design = ConfigService.getDesign();
                user.language = ConfigService.getLanguage();
                user.customScenes = localStorageService.get('customScenes');
                user.customColors = localStorageService.get('customColors');

                var favoriteColors = localStorageService.get('favoriteColors');
                var favoriteColorsArr = [];
                angular.forEach(favoriteColors, function (value, key) {
                    favoriteColorsArr.push(key);
                });
                user.favoriteColors = favoriteColorsArr;

                console.log("save", user, localStorageService.get('customColors'));
                user.$save();
            }
        };

        $scope.loadFromCloud = function () {
            if (DataService.isUserLoggedIn()) {
                var user = User.getUser();
                user.$loaded().then(function () {
                    console.log("load", user);
                    ConfigService.setDesign(user.design);
                    ConfigService.setLanguage(user.language);
                    localStorageService.set('customScenes', user.customScenes);
                    localStorageService.set('customColors', user.customColors);

                    var tmp = {};
                    angular.forEach(user.favoriteColors, function (value) {
                        tmp[value] = value;
                    });

                    localStorageService.set('favoriteColors', tmp);
                });

            }
        };

        $scope.reset = function () {
            localStorage.removeItem("ls.design");
            localStorage.removeItem("ls.customColors");
            localStorage.removeItem("ls.favoriteColors");
        };
    }

    ctrl.$inject = ['$scope', '$state', '$translate', 'ConfigService', 'ColorService', 'ColorDataService', 'User', 'DataService', 'localStorageService'];
    return ctrl;

});
