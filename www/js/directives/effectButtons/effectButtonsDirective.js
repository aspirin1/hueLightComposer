/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function (ColorDataService, DataService, $rootScope, $ionicActionSheet, $ionicPopover) {
        return {
            restrict: 'E',
            scope: {
                selection:"=",
                name: "@",
                start:"="
            },
            link: function (scope, element, attrs) {
                element.addClass("button-bar");

                scope.isEffectRunning = function () {
                    return DataService.isEffectRunning(scope.name);
                };

                scope.stopEffect = function () {
                    DataService.stopEffectByName(scope.name);
                };

                scope.anythingSelected = function () {
                    var retVal = false;
                    angular.forEach(scope.selection, function (value, key) {
                        if (value === true)
                            retVal = true;
                    });
                    return retVal;
                };

                scope.copyToSelection=function(){
                    scope.start();
                    scope.isEffectRunning(scope.name);
                };
            },
            templateUrl: 'js/directives/effectButtons/effectButtons.html'
        };
    };

    directive.$inject = ['ColorDataService', 'DataService', '$rootScope', '$ionicActionSheet', '$ionicPopover'];
    return directive;
});
