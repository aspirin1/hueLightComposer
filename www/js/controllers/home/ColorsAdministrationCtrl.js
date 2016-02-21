/*global angular, define, console, window*/

define(function () {
    'use strict';

    function ctrl($ionicLoading, $scope, $timeout, DataService) {
        console.info("ColorsAdministrationCtrl init");

        $ionicLoading.show({
            template: 'Loading...'
        });

        var loadOwnColors = function () {
            DataService.getOwnColors().then(function (colors) {
                $scope.ownColors = colors;
                $ionicLoading.hide();
            });
        };
        loadOwnColors();


        $scope.removeColor = function (color) {
            DataService.removeCustomColor(color.hexColor);
            loadOwnColors();
        };

        $scope.getBackgroundStyle = function (hexColor) {
            return {
                'background-color': hexColor.toString()
            };
        };
    }

    ctrl.$inject = ['$ionicLoading', '$scope', '$timeout', 'DataService'];
    return ctrl;

});
