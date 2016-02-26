/*global define, console, window,localStorage,angular*/

define(function () {
    'use strict';

    function ctrl(HelperService, $scope, $state, $translate, ConfigService, ColorService, ColorDataService, User, DataService, localStorageService) {

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

        $scope.saveToCloud = function () {
            if (DataService.isUserLoggedIn()) {
                var user = User.getUser();

                user.design = ConfigService.getDesign();
                user.language = ConfigService.getLanguage();
                user.customScenes = localStorageService.get('customScenes');
                user.customColors = localStorageService.get('customColors');
                user.favoriteColors = localStorageService.get('favoriteColors');
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
                });
            }
        };

        $scope.reset = function () {
            localStorage.removeItem("ls.language");
            localStorage.removeItem("ls.design");
            localStorage.removeItem("ls.customScenes");
            localStorage.removeItem("ls.customColors");
            localStorage.removeItem("ls.favoriteColors");
        };
    }

    ctrl.$inject = ['HelperService', '$scope', '$state', '$translate', 'ConfigService', 'ColorService', 'ColorDataService', 'User', 'DataService', 'localStorageService'];
    return ctrl;

});
