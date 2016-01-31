/*global define, console, window,angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $translate, ConfigService, DataService) {

        $scope.stopAllEffects = function () {
            DataService.getEnrichedLightInfos().then(function (data) {
                angular.forEach(data, function (value, key) {
                    DataService.stopEffect(key);
                });
            });
        };
    }

    ctrl.$inject = ['$scope', '$state', '$translate', 'ConfigService', 'DataService'];
    return ctrl;

});
