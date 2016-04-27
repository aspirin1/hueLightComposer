/*global angular, define, console, window*/

define(function () {
    'use strict';

    function ctrl($ionicLoading, $scope, DataService) {


        $scope.$on("$ionicView.beforeEnter", function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
            loadOwnColors();
        });

        var loadOwnColors = function () {
            DataService.getOwnColors().then(function (colors) {
                $scope.ownColors = colors;
                $ionicLoading.hide();
            });
        };

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

    ctrl.$inject = ['$ionicLoading', '$scope', 'DataService'];
    return ctrl;

});
