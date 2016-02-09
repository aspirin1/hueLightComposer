/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($timeout, HueService, ColorService, DataService, UtilityService) {
        var dark_red = ColorService.getXysFromHex("#54001c");
        var dark_purple = ColorService.getXysFromHex("#2c1b3d");
        var light_purple = ColorService.getXysFromHex("#902aaa");
        var green = ColorService.getXysFromHex("#1f8a20");
        var turquois = ColorService.getXysFromHex("#3cd5c0");
        var dark_blue = ColorService.getXysFromHex("#1e228d");

        this.kurzesHellesAufleuchten = function (id, time, minBri, maxBri) {
            UtilityService.resetTimeoutForId(id);
            var warten = 0;
            var aufblenddauer = time / 2;
            var usedMinBri = 40,
                usedMaxBri = 254;

            if (angular.isDefined(minBri)) {
                usedMinBri = minBri;
            }
            if (angular.isDefined(maxBri)) {
                usedMaxBri = maxBri;
            }

            var hellAufblenden = function () {
                HueService.changeLightState(id, {
                    bri: usedMaxBri,
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer)
                });
            };
            var abdunkeln = function () {
                HueService.changeLightState(id, {
                    bri: usedMinBri,
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer)
                });
            };

            UtilityService.delayed(id, hellAufblenden, warten);
            warten += aufblenddauer;
            warten += 1000;

            UtilityService.delayed(id, abdunkeln, warten);
        };

        this.pulsierenMitFarbwechsel1 = function (id, time, xyHell, xyDunkel, minBri, maxBri) {
            UtilityService.resetTimeoutForId(id);
            var warten = 0;
            var aufblenddauer = time / 2;

            var usedMinBri = 40,
                usedMaxBri = 254;

            if (angular.isDefined(minBri)) {
                usedMinBri = minBri;
            }
            if (angular.isDefined(maxBri)) {
                usedMaxBri = maxBri;
            }
            console.info(usedMaxBri);

            var hellAufblenden = function () {
                HueService.changeLightState(id, {
                    bri: usedMinBri,
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer),
                    xy: xyHell
                });
            };
            var abdunkeln = function () {
                HueService.changeLightState(id, {
                    bri: usedMaxBri,
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer),
                    xy: xyDunkel
                });
            };

            UtilityService.delayed(id, hellAufblenden, warten);
            warten += aufblenddauer;
            warten += 1000;

            UtilityService.delayed(id, abdunkeln, warten);
        };

        this.pulsierenMitFarbwechsel2 = function (id, time, xyHell, xyDunkel, minBri, maxBri) {
            UtilityService.resetTimeoutForId(id);
            var warten = 0;
            var aufblenddauer = time / 4;

            var usedMinBri = 40,
                usedMaxBri = 254;

            if (angular.isDefined(minBri)) {
                usedMinBri = minBri;
            }
            if (angular.isDefined(maxBri)) {
                usedMaxBri = maxBri;
            }

            var xy1Aufblenden = function () {
                HueService.changeLightState(id, {
                    bri: usedMinBri,
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer),
                    xy: xyHell
                });
            };
            var xy1Abdunkeln = function () {
                HueService.changeLightState(id, {
                    bri: usedMaxBri,
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer),
                });
            };

            var xy2Aufblenden = function () {
                HueService.changeLightState(id, {
                    bri: usedMinBri,
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer),
                    xy: xyDunkel
                });
            };
            var xy2Abdunkeln = function () {
                HueService.changeLightState(id, {
                    bri: usedMaxBri,
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer),
                });
            };

            UtilityService.delayed(id, xy1Aufblenden, warten);
            warten += aufblenddauer;

            UtilityService.delayed(id, xy1Abdunkeln, warten);
            warten += aufblenddauer;
            warten += 1000;

            UtilityService.delayed(id, xy2Aufblenden, warten);
            warten += aufblenddauer;

            UtilityService.delayed(id, xy2Abdunkeln, warten);
        };

        this.farbwechsel = function (id, farbbereich, time) {
            UtilityService.resetTimeoutForId(id);

            var customLoop = function () {
                HueService.changeLightState(id, {
                    hue_inc: farbbereich,
                    transitiontime: UtilityService.msToTransitionTime(time)
                });
            };

            UtilityService.delayed(id, customLoop, 0);
        };

        this.schnellesBlinken = function (id, bri, time) {
            UtilityService.resetTimeoutForId(id);

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
                UtilityService.delayed(id, changeOnOff, warten, onOffState);
                onOffState = !onOffState;
            }

            UtilityService.delayed(id, changeOnOff, warten, true);
        };

        this.farbverlaufUndZurück = function (id, hue_inc, time) {
            UtilityService.resetTimeoutForId(id);

            var warten = 0;
            var aufblenddauer = time / 2;

            var incHue = function () {
                HueService.changeLightState(id, {
                    hue_inc: parseInt(hue_inc),
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer)
                });
            };

            var decHue = function () {
                HueService.changeLightState(id, {
                    hue_inc: parseInt(hue_inc) * (-1),
                    transitiontime: UtilityService.msToTransitionTime(aufblenddauer)
                });
            };

            UtilityService.delayed(id, incHue, warten);
            warten += aufblenddauer;

            UtilityService.delayed(id, decHue, warten);
        };

        this.helligkeitsFlackernDunklerRegelmaessig = function (id, startBri, time) {
            UtilityService.resetTimeoutForId(id);

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
                UtilityService.delayed(id, normal, warten);
                warten += 500;
                UtilityService.delayed(id, dunkel, warten);
                warten += 300;
            }
            UtilityService.delayed(id, normal, warten);
        };

        this.helligkeitsFlackernDunklerMehrstufig = function (id, startBri, time) {
            UtilityService.resetTimeoutForId(id);

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
                UtilityService.delayed(id, normal, warten);
                warten += 500;
                UtilityService.delayed(id, dunkel, warten);
                warten += 300;
                UtilityService.delayed(id, dunkel2, warten);
                warten += 150;
                UtilityService.delayed(id, dunkel, warten);
                warten += 150;
                UtilityService.delayed(id, dunkel2, warten);
                warten += 150;
            }
            UtilityService.delayed(id, normal, warten);
        };

        this.helligkeitsFlackernDunklerMehrstufigZufall = function (id, startBri, time) {
            UtilityService.resetTimeoutForId(id);

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
                    bri: UtilityService.getRandomInt(startBri - 5, startBri - 10)
                });
            };

            var dunkel2 = function () {
                HueService.changeLightState(id, {
                    transitiontime: 1,
                    bri: UtilityService.getRandomInt(startBri - 15, startBri - 20)
                });
            };

            for (warten = 0; warten < time;) {
                UtilityService.delayed(id, normal, warten);
                warten += UtilityService.getRandomInt(300, 500);
                UtilityService.delayed(id, dunkel, warten);
                warten += UtilityService.getRandomInt(150, 300);
                UtilityService.delayed(id, dunkel2, warten);
                warten += UtilityService.getRandomInt(120, 200);
                UtilityService.delayed(id, dunkel, warten);
                warten += UtilityService.getRandomInt(160, 300);
                UtilityService.delayed(id, dunkel2, warten);
                warten += UtilityService.getRandomInt(200, 400);
            }
            UtilityService.delayed(id, normal, warten);
        };

        this.helligkeitsFlackernHellerRegelmaessig = function (id, startBri, time) {
            UtilityService.resetTimeoutForId(id);

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
                UtilityService.delayed(id, normal, warten);
                warten += 500;
                UtilityService.delayed(id, heller, warten);
                warten += 300;
            }
            UtilityService.delayed(id, normal, warten);
        };

        this.ausUndUnregelmaessigAufblitzen = function (id, blitzMin, blitzMax, time) {
            UtilityService.resetTimeoutForId(id);

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

                UtilityService.delayed(id, vorblitz, blitzWarten, 100);
                blitzWarten += 50;
                UtilityService.delayed(id, aus, warten);
                blitzWarten += 50;

                UtilityService.delayed(id, vorblitz, blitzWarten, 50);
                blitzWarten += 50;
                UtilityService.delayed(id, aus, warten);
                blitzWarten += 200;

                return blitzWarten;
            };

            //550ms
            var blitz2 = function () {
                var blitzWarten = vorblitzEffekt();
                UtilityService.delayed(id, blitz, blitzWarten);
                blitzWarten += 200;
            };

            console.info("neue runde");
            UtilityService.delayed(id, aus, warten);
            warten += 100;

            while (warten < time) {
                var randomWarten = UtilityService.getRandomInt(minWait, maxWait);
                console.info("nächste blitz " + randomWarten + " warte: " + parseInt(warten + randomWarten));
                warten += randomWarten;
                if (warten <= time) {
                    UtilityService.delayed(id, blitz2, warten);
                    warten += 700;
                    UtilityService.delayed(id, aus, warten);
                }
            }
        };



        return this;
    };

    factory.$inject = ['$timeout', 'HueService', 'ColorService', 'DataService', 'UtilityService'];
    return factory;
});
