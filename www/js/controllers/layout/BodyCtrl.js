/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, ConfigService) {

        $scope.theme = function () {
            var design = ConfigService.getDesign();

            if (angular.isUndefined(design) || design === null) {
                design = "light";
            }

            if (design === null)
                design = "light";

            return design;
        };
    }

    ctrl.$inject = ['$scope', 'ConfigService'];
    return ctrl;

});
