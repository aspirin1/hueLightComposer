/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($timeout, HueService, ColorService) {

        function round(value, decimals) {
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        }

        /**
         * Returns a random number between min (inclusive) and max (exclusive)
         */
        function getRandomArbitrary(min, max) {
            return round(Math.random() * (max - min) + min, 5);
        }

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give you a non-uniform distribution!
         */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function msToTransitionTime(time) {
            return parseInt(time / 100);
        }

        var dark_red = ColorService.getXysFromHex("#54001c");
        var dark_purple = ColorService.getXysFromHex("#2c1b3d");
        var light_purple = ColorService.getXysFromHex("#902aaa");
        var green = ColorService.getXysFromHex("#1f8a20");
        var turquois = ColorService.getXysFromHex("#3cd5c0");
        var dark_blue = ColorService.getXysFromHex("#1e228d");

        this.kurzesHellesAufleuchten = function (id, xy, time) {
            var warten = 0;

            var aufblenddauer = time / 2;
            HueService.changeLightState(id, {
                bri: 254,
                //xy: xy,
                transitiontime: msToTransitionTime(aufblenddauer)
            });
            warten += aufblenddauer;

            $timeout(function () {
                HueService.changeLightState(id, {
                    bri: 40,
                    transitiontime: msToTransitionTime(aufblenddauer)
                });
            }, warten, false);
        };

        this.schnellesBlinken = function (id, bri, time) {
            var warten = 0;

            var onOffState = false;

            var changeOnOff = function (newState) {
                HueService.changeLightState(id, {
                    on: newState,
                    transitiontime: 0,
                    bri: bri
                });
            };

            for (warten = 0; warten < time; warten += 100) {
                $timeout(changeOnOff, warten, false, onOffState);
                onOffState = !onOffState;
            }
            $timeout(changeOnOff, warten, false, true);
        };

        this.farbverlaufUndZurück = function (id, hue_inc, time) {
            var warten = 0;

            var aufblenddauer = time / 2;
            HueService.changeLightState(id, {
                hue_inc: parseInt(hue_inc),
                transitiontime: msToTransitionTime(aufblenddauer)
            });
            warten += aufblenddauer;

            $timeout(function () {
                HueService.changeLightState(id, {
                    hue_inc: parseInt(hue_inc) * (-1),
                    transitiontime: msToTransitionTime(aufblenddauer)
                });
            }, warten, false);
        };

        this.helligkeitsFlackernDunklerRegelmaessig = function (id, startBri, time) {
            var warten = 0;

            var dunkelBri = startBri - 7;

            var normal = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: startBri
                });
            };

            var dunkel = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: dunkelBri
                });
            };

            for (warten = 0; warten < time;) {
                $timeout(normal, warten, false);
                warten += 500;
                $timeout(dunkel, warten, false);
                warten += 300;
            }
            $timeout(normal, warten, false);
        };

        this.helligkeitsFlackernDunklerMehrstufig = function (id, startBri, time) {
            var self = this;
            var warten = 0;
            var dunkelBri = startBri - 7;
            var dunkelBri2 = dunkelBri - 7;

            var normal = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: startBri
                });
            };

            var dunkel = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: dunkelBri
                });
            };

            var dunkel2 = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: dunkelBri2
                });
            };

            for (warten = 0; warten < time;) {
                $timeout(normal, warten, false);
                warten += 500;
                $timeout(dunkel, warten, false);
                warten += 300;
                $timeout(dunkel2, warten, false);
                warten += 150;
                $timeout(dunkel, warten, false);
                warten += 150;
                $timeout(dunkel2, warten, false);
                warten += 150;
            }
            $timeout(normal, warten, false);
        };

        this.helligkeitsFlackernDunklerMehrstufigZufall = function (id, startBri, time) {
            var self = this;
            var warten = 0;
            var dunkelBri = startBri - 7;
            var dunkelBri2 = dunkelBri - 7;

            var normal = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: startBri
                });
            };

            var dunkel = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: getRandomInt(startBri - 5, startBri - 10)
                });
            };

            var dunkel2 = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: getRandomInt(startBri - 15, startBri - 20)
                });
            };

            for (warten = 0; warten < time;) {
                $timeout(normal, warten, false);
                warten += getRandomInt(300, 500);
                $timeout(dunkel, warten, false);
                warten += getRandomInt(150, 300);
                $timeout(dunkel2, warten, false);
                warten += getRandomInt(120, 200);
                $timeout(dunkel, warten, false);
                warten += getRandomInt(160, 300);
                $timeout(dunkel2, warten, false);
                warten += getRandomInt(200, 400);
            }
            $timeout(normal, warten, false);
        };

        this.helligkeitsFlackernHellerRegelmaessig = function (id, startBri, time) {
            var warten = 0;

            var hellBri = startBri + 7;

            var normal = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: startBri
                });
            };

            var heller = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: hellBri
                });
            };

            for (warten = 0; warten < time;) {
                $timeout(normal, warten, false);
                warten += 500;
                $timeout(heller, warten, false);
                warten += 300;
            }
            $timeout(normal, warten, false);
        };

        this.ausUndUnregelmaessigAufblitzen = function (id, blitzMin, blitzMax, time) {
            var self = this;
            var warten = 0;
            var minWait = parseInt(blitzMin),
                maxWait = parseInt(blitzMax);

            if (minWait < 100)
                minWait = 100;

            var aus = function () {
                HueService.changeLightState(id, {
                    transitiontime: 0,
                    on: false
                });
            };

            var blitz = function () {
                HueService.changeLightState(id, {
                    on: true,
                    transitiontime: 0,
                    bri: 254
                });
            };

            var vorblitz = function (bri) {
                HueService.changeLightState(id, {
                    on: true,
                    transitiontime: 0,
                    bri: bri
                });
            };

            //350ms
            var vorblitzEffekt = function () {
                var blitzWarten = 0;

                $timeout(vorblitz, blitzWarten, false, 100);
                blitzWarten += 50;
                $timeout(aus, warten, false);
                blitzWarten += 50;

                $timeout(vorblitz, blitzWarten, false, 50);
                blitzWarten += 50;
                $timeout(aus, warten, false);
                blitzWarten += 200;

                return blitzWarten;
            };

            //550ms
            var blitz2 = function () {
                var blitzWarten = vorblitzEffekt();
                $timeout(blitz, blitzWarten, false);
                blitzWarten += 200;
            };

            $timeout(aus, warten, false);
            warten += 100;

            while (warten < time) {
                $timeout(blitz2, warten, false);
                warten += 700;
                $timeout(aus, warten, false);
                warten += getRandomInt(minWait, maxWait);
            }
            $timeout(aus, warten, false);
        };



        return this;
    };

    factory.$inject = ['$timeout', 'HueService', 'ColorService'];
    return factory;
});
