/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $translate, ConfigService) {

        $scope.selectedLanguage = $translate.use();
        $scope.languageChanged = function (key) {
            ConfigService.setLanguage(key);
            $translate.use(key);
        };

        $scope.selectedDesign = $scope.getDesign();
        $scope.designChanged = function (key) {
            ConfigService.setDesign(key);
            $scope.getDesign();
        };
    }

    ctrl.$inject = ['$scope', '$state', '$translate', 'ConfigService'];
    return ctrl;

});
