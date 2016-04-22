/*global angular, define, console, window,navigator,alert*/
define(function () {
    'use strict';

    function ctrl($rootScope, $scope, HueService, UtilityService) {
        console.info("GroupCommandCtrl init", $scope.groupId);

        var refreshLightInBackground;
        var unregisterEvent;

        var getGroupInfo = function () {
            HueService.getGroup($scope.groupId).then(function (groupData) {
                $scope.group = groupData;
                console.info($scope.groupId, $scope.group);

                $scope.brightnessOptions = {
                    start: [$scope.group.action.bri],
                    connect: 'lower',
                    step: 1,
                    range: {
                        'min': 1,
                        'max': 254
                    }
                };

                $scope.saturationOptions = {
                    start: [$scope.group.action.sat],
                    connect: 'lower',
                    step: 1,
                    range: {
                        'min': 1,
                        'max': 254
                    }
                };

                $scope.hueOptions = {
                    start: [$scope.group.action.hue],
                    connect: 'lower',
                    step: 500,
                    range: {
                        'min': 0,
                        'max': 65535
                    }
                };
            });
        };

        $scope.$on("$ionicView.beforeEnter", function () {


            unregisterEvent = $rootScope.$on('ColorChanged', function (event, color) {
                HueService.changeGroupToHexColor($scope.groupId, "C", color);
            });
            getGroupInfo();
        });

        $scope.$on("$destroy", function () {
            unregisterEvent();
        });


        $scope.brightnessSliderEvents = {
            change: function (values, handle, unencoded) {
                var bri = parseInt(values[0][0]);
                HueService.changeGroupBrightness($scope.groupId, bri);
            }
        };

        $scope.saturationSliderEvents = {
            change: function (values, handle, unencoded) {
                var sat = parseInt(values[0][0]);
                HueService.changeGroupSaturation($scope.groupId, sat);
            }
        };

        $scope.hueSliderEvents = {
            change: function (values, handle, unencoded) {
                var hue = parseInt(values[0][0]);
                HueService.changeGroupHue($scope.groupId, hue);
            }
        };

        $scope.toggleLightOnOff = function () {
            HueService.turnGroupOnOff($scope.groupId, $scope.group.action.on).then(function (data) {
                getGroupInfo();
            });
        };

        $scope.getBrightnessPercentage = function (light) {
            if (typeof ($scope.group) !== "undefined") {
                var maxBri = 254.0;
                var lightBri = $scope.group.action.bri;
                return UtilityService.calculateFormattedPercentage(maxBri, lightBri);
            }
        };

        $scope.getSaturationPercentage = function (light) {
            if (typeof ($scope.group) !== "undefined") {
                var maxSat = 254.0;
                var lightBri = $scope.group.action.sat;
                return UtilityService.calculateFormattedPercentage(maxSat, lightBri);
            }
        };

        $scope.brightnessChanged = function () {
            if (typeof ($scope.group) !== "undefined") {
                var val = $scope.group.action.bri;
                HueService.changeBrightness($scope.lightId, val);
            }
        };

        $scope.saturationChanged = function () {
            if (typeof ($scope.group) !== "undefined") {
                var val = $scope.group.action.sat;
                HueService.changeGroupSaturation($scope.groupId, val).then(function (data) {

                });
            }
        };

        $scope.hueChanged = function () {
            if (typeof ($scope.group) !== "undefined") {
                var val = $scope.group.action.hue;
                HueService.changeGroupHue($scope.groupId, val).then(function (data) {

                });
            }
        };



        $scope.getColorGradient = function () {
            var css = {};

            var hslColors = [];
            for (var i = 0; i <= 360; i += 10) {
                var percentage = 0;
                if (i > 0) {
                    percentage = ((parseFloat(i) / 360.0) * 100).toFixed(2);
                }
                var color = "hsl(" + i + ", 100%, 50%) " + percentage + "%";
                hslColors.push(color);
            }

            var linGradient = "linear-gradient(90deg, ";
            angular.forEach(hslColors, function (colorString) {
                linGradient += (colorString + ",");
            });
            linGradient = linGradient.slice(0, -1); //remove last ','
            linGradient += ");";

            css['background-image'] = linGradient;

            console.log(css);
            return css;
        };
    }

    ctrl.$inject = ['$rootScope', '$scope', 'HueService', 'UtilityService'];
    return ctrl;

});