/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function (ColorDataService) {

        return {
            restrict: 'E',
            scope: {
                colors: "="
            },
            link: function (scope, element, attrs) {
                scope.colors = scope.colors || ["#ffffff", "#ddd"];

                scope.fillRandom = function () {
                    var cnt = scope.colors.length;
                    scope.colors = [];
                    for (var i = 0; i < cnt; i++) {
                        scope.colors.push(ColorDataService.getRandomHexColorForGamutC());
                    }
                };
            },
            templateUrl: 'js/directives/newMultiColorPicker/newMultiColorPicker.html'
        };
    };

    directive.$inject = ['ColorDataService'];
    return directive;
});