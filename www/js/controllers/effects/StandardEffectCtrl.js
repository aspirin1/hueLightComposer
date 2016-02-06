/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $state, $translate, DataService, HueService, EffectService, ColorService, $interval) {
        console.log("StandardEffectCtrl", $scope.effect);

        function getLightById(key) {
            for (var i = 0; i < $scope.allLights.length; i++) {
                if ($scope.allLights[i].id === key) {
                    return $scope.allLights[i];
                }
            }
        }

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                value.id = key;
                tmp.push(value);
            });
            $scope.allLights = tmp;
        });

        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var dark_blue_nightSky = ColorService.getXysFromHex("#1e228d");
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(getLightById(key).id);
                    DataService.stopEffect(lightId);

                    HueService.changeLightState(lightId, {
                        on: true,
                        bri: 40,
                        xy: dark_blue_nightSky.gamutCxy,
                        transitiontime: 5
                    });

                    DataService.setEffect(lightId, "aurora", $interval(EffectService.auroraEffect, 11000, 0, false, lightId, "C"));
                }
            });
        };

        $scope.test = function () {
            var dark_red = ColorService.getXysFromHex("#54001c");
            var dark_purple = ColorService.getXysFromHex("#2c1b3d");
            var light_purple = ColorService.getXysFromHex("#902aaa");
            var green = ColorService.getXysFromHex("#6bff5a");
            var dark_blue_nightSky = ColorService.getXysFromHex("#1e228d");
            var turquois = ColorService.getXysFromHex("#3cd5c0");

            //console.log(dark_blue_nightSky);
            //            HueService.changeLightState(5, {
            //                on: true,
            //                bri: 40,
            //                xy: dark_blue_nightSky.gamutCxy,
            //                transitiontime: 5
            //            });
            HueService.changeLightState(1, {
                on: true,
                bri: 40,
                xy: dark_blue_nightSky.gamutCxy,
                transitiontime: 5
            });
            HueService.changeLightState(2, {
                on: true,
                bri: 40,
                xy: dark_blue_nightSky.gamutCxy,
                transitiontime: 5
            });
            HueService.changeLightState(3, {
                on: true,
                bri: 40,
                xy: dark_blue_nightSky.gamutCxy,
                transitiontime: 5
            });

            EffectService.auroraFestEffect([1, 2, 3], "B");
            DataService.setGroupEffect(1, [1, 2, 3], "auroraFest", $interval(EffectService.auroraFestEffect, 30000, 0, false, [1, 2, 3], "B"));
            //DataService.setEffect(5, "aurora", $interval(EffectService.auroraEffect, 11000, 0, false, 5, "C"));
            //console.log(dark_red, dark_purple, light_purple, green, dark_blue_nightSky, turquois);
        };

        $scope.test2 = function () {
            var dark_red = ColorService.getXysFromHex("#54001c");
            var dark_purple = ColorService.getXysFromHex("#2c1b3d");
            var light_purple = ColorService.getXysFromHex("#902aaa");
            var green = ColorService.getXysFromHex("#6bff5a");
            var dark_blue_nightSky = ColorService.getXysFromHex("#1e228d");
            var turquois = ColorService.getXysFromHex("#3cd5c0");
            console.log(dark_red, dark_purple, light_purple, green, dark_blue_nightSky, turquois);
        };
    }

    ctrl.$inject = ['$scope', '$state', '$translate', 'DataService', 'HueService', 'EffectService', 'ColorService', '$interval'];
    return ctrl;

});
