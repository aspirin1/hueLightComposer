/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, ConfigService) {
        $scope.getDesign = function () {
            var design = ConfigService.getDesign();
            if (design === null)
                return "app-light"
            return design;
        };
    }

    ctrl.$inject = ['$scope', 'ConfigService'];
    return ctrl;

});
