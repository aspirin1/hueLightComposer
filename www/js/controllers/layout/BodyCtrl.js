/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, ConfigService) {

        $scope.theme = function () {
            var design = ConfigService.getDesign();
            if (design.indexOf("app") >= 0)
                design = "light";

            if (design === null)
                design = "light";

            return design;
        };
    }

    ctrl.$inject = ['$scope', 'ConfigService'];
    return ctrl;

});
