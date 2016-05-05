/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function (ColorDataService) {

        return {
            restrict: 'E',
            scope: {
                pickerSettings: "="
            },
            link: function (scope, element, attrs) {
                scope.pickerSettings = scope.pickerSettings || {
                    colors: [{
                        color: "#ffffff"
                    }]
                };


                scope.fillRandom = function () {
                    var cnt = scope.pickerSettings.colors.length;
                    scope.pickerSettings.colors = [];
                    for (var i = 0; i < cnt; i++) {
                        scope.pickerSettings.colors.push({
                            color: ColorDataService.getRandomHexColorForGamutC()
                        });
                    }
                };
            },
            templateUrl: 'js/directives/newMultiColorPicker/newMultiColorPicker.html'
        };
    };

    directive.$inject = ['ColorDataService'];
    return directive;
});