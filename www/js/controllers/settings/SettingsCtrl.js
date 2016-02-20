/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $translate, ConfigService) {

        $scope.selectedLanguage = $translate.use();
        $scope.languageChanged = function (key) {
            ConfigService.setLanguage(key);
            $translate.use(key);
        };

        $scope.selectedDesign = $scope.theme();
        $scope.designChanged = function (key) {
            ConfigService.setDesign(key);
        };

        $scope.reset = function () {
            localStorage.removeItem("ls.design");
            localStorage.removeItem("ls.customColors");
            localStorage.removeItem("ls.favoriteColors");
        };
    }

    ctrl.$inject = ['$scope', '$state', '$translate', 'ConfigService'];
    return ctrl;

});
