/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, ConfigService) {

        $scope.theme = function () {
            var design = ConfigService.getDesign();
            if (angular.isDefined(design) && angular.isDefined(design.key))
                return design.key;

            if (angular.isUndefined(design) || design === null || angular.isUndefined(design.key) || typeof (design) === "string") {
                design = {};
                design.key = "light";
            }

            return design.key;
        };
    }

    ctrl.$inject = ['$scope', 'ConfigService'];
    return ctrl;

});
