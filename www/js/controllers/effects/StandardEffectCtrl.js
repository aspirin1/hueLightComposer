/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, $filter, DataService, HueService, EffectService, LightCommandService, ColorService, $interval) {
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

        $scope.effectName = $filter('translate')('Effect_' + $scope.effect);
        $scope.getEffectRunning = function (lightId) {
            if ($scope.allLights.length > 0) {
                var eff = DataService.getEffect(lightId);
                if (angular.isUndefined(eff)) {
                    return $filter('translate')('NO_EFFECT_RUNNING');
                } else {
                    return eff.effect;
                }
            }
        };

        $scope.copySelection = {};
        $scope.copyToSelection = function () {
            var dark_blue_nightSky = ColorService.getXysFromHex("#1e228d");

            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var lightId = parseInt(getLightById(key).id);
                    DataService.stopEffect(lightId);
                    if ($scope.effect === "Aurora") {

                        HueService.changeLightState(lightId, {
                            on: true,
                            bri: 40,
                            xy: dark_blue_nightSky.gamutCxy,
                            transitiontime: 5
                        });

                        DataService.setEffect(lightId,
                            $filter('translate')('Effect_' + $scope.effect),
                            $interval(EffectService.auroraEffect, 11000, 0, false, lightId, "C"));
                    }
                    if ($scope.effect === "Candle") {
                        HueService.changeLightState(lightId, {
                            on: true,
                            bri: 42,
                            xy: [0.5676, 0.3877],
                        });

                        EffectService.candleEffect(lightId);
                        DataService.setEffect(lightId,
                            $filter('translate')('Effect_' + $scope.effect),
                            $interval(EffectService.candleEffect, 2000, 0, false, lightId));
                    }
                    if ($scope.effect === "Lightning") {
                        HueService.changeLightState(lightId, {
                            on: false,
                        });
                        LightCommandService.ausUndUnregelmaessigAufblitzen(lightId, 500, 7000, 8000);
                        DataService.setEffect(lightId,
                            $filter('translate')('Effect_' + $scope.effect),
                            $interval(
                                LightCommandService.ausUndUnregelmaessigAufblitzen,
                                8500, 0, false, lightId, 500, 7000, 8000));
                    }
                    if ($scope.effect === "Pulse") {
                        HueService.changeLightState(lightId, {
                            on: false,
                        });
                        LightCommandService.kurzesHellesAufleuchten(lightId, 10000);
                        DataService.setEffect(lightId,
                            $filter('translate')('Effect_' + $scope.effect),
                            $interval(
                                LightCommandService.kurzesHellesAufleuchten,
                                10500, 0, false, lightId, 10000));
                    }
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
        };

    }

    ctrl.$inject = ['$scope', '$filter', 'DataService', 'HueService', 'EffectService', 'LightCommandService', 'ColorService', '$interval'];
    return ctrl;

});
