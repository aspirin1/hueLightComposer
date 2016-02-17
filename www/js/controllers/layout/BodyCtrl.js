/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, ConfigService) {

        $scope.getDesign = function () {
            var design = ConfigService.getDesign();
            if (design === null)
                return "app-light";
            return design;
        };

        $scope.theme = function () {
            var design = ConfigService.getDesign();
            if (design === null)
                design = "app-light";
            if (design === "app-light")
                return "light";
            return "dark";
        };
    }

    ctrl.$inject = ['$scope', 'ConfigService'];
    return ctrl;

});
