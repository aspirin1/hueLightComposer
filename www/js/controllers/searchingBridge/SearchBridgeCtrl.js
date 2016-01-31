/*global define, console, window*/

define(function () {
    'use strict';

    function ctrl($scope, $state, ConfigService, HueService) {

        $scope.searchingBridge = true;
        $scope.trialCount = 1;

        var tryCreateUser = function () {
            HueService.createUser().then(function (data) {
                if (typeof (data[0].error) !== 'undefined' && data[0].error.type === 101) {
                    window.setTimeout(tryCreateUser, 1000);
                    $scope.trialCount++;
                } else {
                    ConfigService.setUserId(data[0].success.username);
                    $state.go('main.home_tab.lightList');
                }
            });
        };

        HueService.getBridgeInfo().then(function (data) {
            $scope.searchingBridge = false;
            ConfigService.setBridgeUrl('http://' + data[0].internalipaddress);
            tryCreateUser();
        });
    }

    ctrl.$inject = ['$scope', '$state', 'ConfigService', 'HueService'];
    return ctrl;

});
