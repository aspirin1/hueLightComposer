/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($interval, $timeout, HueService, ColorService, DataService, LightCommandService, UtilityService) {
        var self = this;
        var dark_red = ColorService.getXysFromHex("#54001c");
        var dark_purple = ColorService.getXysFromHex("#2c1b3d");
        var light_purple = ColorService.getXysFromHex("#902aaa");
        var green = ColorService.getXysFromHex("#1f8a20");
        var dark_blue_nightSky = ColorService.getXysFromHex("#1e228d");
        var turquois = ColorService.getXysFromHex("#3cd5c0");

        this.startCarousel = function (orderedSelectedLights, timeInMs, xyColors) {
            angular.forEach(orderedSelectedLights, function (lightId) {
                DataService.stopEffect(lightId);
            });

            LightCommandService.setCarouselColors(xyColors);

            for (var i = 0; i < orderedSelectedLights.length; i++) {
                HueService.changeLightState(orderedSelectedLights[i], {
                    on: true,
                    xy: xyColors[i],
                    bri: 200,
                    transitiontime: 0,
                });
            }

            var interval = $interval(LightCommandService.carousel, timeInMs + 300, 0, false, orderedSelectedLights, timeInMs);

            angular.forEach(orderedSelectedLights, function (lightId) {
                DataService.setEffect(lightId, "Carousel", interval);
            });

            LightCommandService.carousel(orderedSelectedLights, timeInMs);
        };

        this.startBeacon = function (orderedSelectedLights, timeInMs, xyColor) {
            angular.forEach(orderedSelectedLights, function (lightId) {
                DataService.stopEffect(lightId);
            });

            HueService.changeLightState(orderedSelectedLights[0], {
                on: true,
                xy: xyColor,
                bri: 200,
                transitiontime: 0,
            });

            var interval = $interval(LightCommandService.beacon, timeInMs + 300, 0, false, orderedSelectedLights, timeInMs, xyColor);

            angular.forEach(orderedSelectedLights, function (lightId) {
                DataService.setEffect(lightId, "Beacon", interval);
            });

            LightCommandService.beacon(orderedSelectedLights, timeInMs, xyColor);
        };

        this.startStrobe = function (lightId, maxBri, time, zufallsfarbenVerwenden) {
            DataService.stopEffect(lightId);



            var effektDauer = 8000;

            var usedMaxBri = 254;
            var usedTiming = 150;
            var usedZufallsfarbenVerwenden = false;

            if (angular.isDefined(maxBri)) {
                usedMaxBri = maxBri;
            }
            if (angular.isDefined(time)) {
                usedTiming = time;
            }
            if (angular.isDefined(zufallsfarbenVerwenden)) {
                usedZufallsfarbenVerwenden = zufallsfarbenVerwenden;
            }

            HueService.changeLightState(lightId, {
                on: true,
                //bri: usedMaxBri
            });

            var interval = $interval(
                LightCommandService.schnellesBlinken,
                effektDauer + 150, 0, false, lightId, effektDauer, usedMaxBri, usedTiming, usedZufallsfarbenVerwenden);
            DataService.setEffect(lightId, "Strobe", interval);
            LightCommandService.schnellesBlinken(lightId, effektDauer, usedMaxBri, usedTiming, usedZufallsfarbenVerwenden);
        };

        this.startColorLoop = function (lightId, timeInMs) {
            DataService.stopEffect(lightId);

            HueService.changeLightState(lightId, {
                on: true,
            });

            var interval = $interval(LightCommandService.farbwechsel, timeInMs, 0, false, lightId, 5000, timeInMs);
            DataService.setEffect(lightId, 'ColorLoop', interval);
            LightCommandService.farbwechsel(lightId, 5000, timeInMs);
        };

        this.startAurora = function (lightId) {
            DataService.stopEffect(lightId);

            HueService.changeLightState(lightId, {
                on: true,
                bri: 40,
                xy: dark_blue_nightSky.gamutCxy,
                transitiontime: 5
            });

            var interval = $interval(self.auroraEffect, 11000, 0, false, lightId, "C");
            DataService.setEffect(lightId, "Aurora", interval);
            self.auroraEffect(lightId, "C");
        };

        this.startCandle = function (lightId) {
            DataService.stopEffect(lightId);

            HueService.changeLightState(lightId, {
                on: true,
                bri: 42,
                xy: [0.5676, 0.3877],
            });

            var interval = $interval(self.candleEffect, 2000, 0, false, lightId);
            DataService.setEffect(lightId, "Candle", interval);
            self.candleEffect(lightId);
        };

        this.startLightning = function (lightId, maxZeitZwischenBlitz, zufallsfarbenVerwenden) {
            DataService.stopEffect(lightId);

            HueService.changeLightState(lightId, {
                on: false,
            });

            var effektDauer = 8000;
            var minZeitZwischenBlitzen = 500;
            var maxZeitZwischenBlitzen = 7000;

            if (angular.isDefined(maxZeitZwischenBlitz)) {
                maxZeitZwischenBlitzen = maxZeitZwischenBlitz;
                effektDauer = maxZeitZwischenBlitz + 1000;
            }
            console.info(maxZeitZwischenBlitzen);

            var interval = $interval(
                LightCommandService.ausUndUnregelmaessigAufblitzen,
                effektDauer + 500, 0, false, lightId, minZeitZwischenBlitzen, maxZeitZwischenBlitzen, effektDauer, zufallsfarbenVerwenden);
            DataService.setEffect(lightId, "Lightning", interval);
            LightCommandService.ausUndUnregelmaessigAufblitzen(lightId, minZeitZwischenBlitzen, maxZeitZwischenBlitzen, effektDauer, zufallsfarbenVerwenden);
        };

        this.startPulse = function (lightId, duration, minBri, maxBri, xy1) {
            DataService.stopEffect(lightId);

            HueService.changeLightState(lightId, {
                on: true,
                bri: 40
            });

            var effektDauer = 10000,
                usedMinBri = 40,
                usedMaxBri = 254,
                usedXy1;
            if (angular.isDefined(duration)) {
                effektDauer = duration;
            }
            if (angular.isDefined(minBri)) {
                usedMinBri = minBri;
            }
            if (angular.isDefined(maxBri)) {
                usedMaxBri = maxBri;
            }
            if (angular.isDefined(xy1)) {
                usedXy1 = xy1;
            }

            var interval = $interval(
                LightCommandService.kurzesHellesAufleuchten,
                effektDauer + 1500, 0, false, lightId, effektDauer, usedMinBri, usedMaxBri, usedXy1);
            DataService.setEffect(lightId, "Pulse", interval);
            LightCommandService.kurzesHellesAufleuchten(lightId, effektDauer, usedMinBri, usedMaxBri, usedXy1);
        };

        this.startPulsierenMitFarbwechsel1 = function (lightId, duration, minBri, maxBri, xy1, xy2) {
            DataService.stopEffect(lightId);

            HueService.changeLightState(lightId, {
                on: true,
                bri: 40
            });

            var effektDauer = 10000,
                usedMinBri = 40,
                usedMaxBri = 254,
                usedXy1 = [0.2725, 0.1096],
                usedXy2 = [0.2703, 0.1398];

            if (angular.isDefined(duration)) {
                effektDauer = duration;
            }
            if (angular.isDefined(minBri)) {
                usedMinBri = minBri;
            }
            if (angular.isDefined(maxBri)) {
                usedMaxBri = maxBri;
            }
            if (angular.isDefined(xy1)) {
                usedXy1 = xy1;
            }
            if (angular.isDefined(xy2)) {
                usedXy2 = xy2;
            }

            var interval = $interval(
                LightCommandService.pulsierenMitFarbwechsel1,
                effektDauer + 1500, 0, false, lightId, effektDauer, usedXy1, usedXy2, usedMinBri, usedMaxBri); //[0.2703, 0.1398]
            DataService.setEffect(lightId, "PulseColorTransition", interval);
            LightCommandService.pulsierenMitFarbwechsel1(lightId, effektDauer, usedXy1, usedXy2, usedMinBri, usedMaxBri);
        };

        this.startPulsierenMitFarbwechsel2 = function (lightId, duration, minBri, maxBri, xy1, xy2) {
            DataService.stopEffect(lightId);

            HueService.changeLightState(lightId, {
                on: true,
                bri: 40
            });

            var effektDauer = 10000,
                usedMinBri = 40,
                usedMaxBri = 254,
                usedXy1 = [0.2725, 0.1096],
                usedXy2 = [0.2703, 0.1398];

            if (angular.isDefined(duration)) {
                effektDauer = duration * 2;
            }
            if (angular.isDefined(minBri)) {
                usedMinBri = minBri;
            }
            if (angular.isDefined(maxBri)) {
                usedMaxBri = maxBri;
            }
            if (angular.isDefined(xy1)) {
                usedXy1 = xy1;
            }
            if (angular.isDefined(xy2)) {
                usedXy2 = xy2;
            }

            var interval = $interval(
                LightCommandService.pulsierenMitFarbwechsel2,
                effektDauer + 2500, 0, false, lightId, effektDauer, usedXy1, usedXy2, usedMinBri, usedMaxBri);
            DataService.setEffect(lightId, "PulseChangingColors", interval);
            LightCommandService.pulsierenMitFarbwechsel2(lightId, effektDauer, usedXy1, usedXy2, usedMinBri, usedMaxBri);
        };


        this.candleEffect = function (lightId) {
            UtilityService.resetTimeoutForId(lightId);

            var minBri = 36,
                maxBri = 43,
                minX = 0.56,
                maxX = 0.575,
                minY = 0.382,
                maxY = 0.39;

            var ausgangszustand = function () {
                HueService.changeLightState(lightId, {
                    bri: UtilityService.getRandomInt(38, 42),
                    xy: UtilityService.getRandomXy(minX, maxX, minY, maxY),
                    transitiontime: UtilityService.getRandomInt(1, 3)
                });
            };

            var steilAbfallen = function (minBri, maxBri) {
                HueService.changeLightState(lightId, {
                    bri: UtilityService.getRandomInt(minBri, maxBri),
                    transitiontime: 1
                });
            };

            var aufBriWechseln = function (bri, time) {
                HueService.changeLightState(lightId, {
                    bri: bri,
                    transitiontime: time
                });
            };

            var dunklesFlackern = function () {
                console.log('dunklesFlackern');
                var tmp = function () {
                    HueService.changeLightState(lightId, {
                        bri: UtilityService.getRandomInt(34, 36),
                        transitiontime: 1,
                        xy: UtilityService.getRandomXy(minX, maxX, minY, maxY)
                    });
                };
                UtilityService.delayed(lightId, tmp, 0);
                UtilityService.delayed(lightId, ausgangszustand, 200);
            };

            var hellerAusreisser = function () {
                console.log('hellerAusreisser');
                var tmp = function () {
                    HueService.changeLightState(lightId, {
                        bri: UtilityService.getRandomInt(43, 46),
                        transitiontime: 4,
                        xy: UtilityService.getRandomXy(minX, maxX, minY, maxY)
                    });
                };
                UtilityService.delayed(lightId, tmp, 0);
                UtilityService.delayed(lightId, ausgangszustand, 500);
            };

            var doppeltesFlackern = function () {
                console.log('doppeltesFlackern');
                steilAbfallen(35, 35); //100ms
                //+300ms warten
                UtilityService.delayed(lightId, aufBriWechseln, 400, 40, 3); //300ms
                //+100ms warten
                UtilityService.delayed(lightId, steilAbfallen, 800, 37, 37); //100ms
                //+300ms warten
                UtilityService.delayed(lightId, ausgangszustand, 1200);
            };

            var flimmern = function () {
                console.log('flimmern');
                UtilityService.delayed(lightId, aufBriWechseln, 0, 35, 0); //100ms
                //+200ms warten
                UtilityService.delayed(lightId, aufBriWechseln, 300, 38, 0); //100ms
                //+200ms warten
                UtilityService.delayed(lightId, aufBriWechseln, 600, 36, 0); //100ms
                //+200ms warten
                UtilityService.delayed(lightId, aufBriWechseln, 900, 39, 0); //100ms
                //+200ms warten
                UtilityService.delayed(lightId, ausgangszustand, 1200);
            };

            var ganzSchnellesFlimmern = function () {
                console.log('ganzSchnellesFlimmern');
                var warten = 0;

                UtilityService.delayed(lightId, aufBriWechseln, warten, 35, 0);
                //+100ms warten
                warten += 100;

                UtilityService.delayed(lightId, aufBriWechseln, warten, 40, 1);
                //+100ms warten
                warten += 100;

                UtilityService.delayed(lightId, aufBriWechseln, warten, 35, 0);
                //+100ms warten
                warten += 100;

                UtilityService.delayed(lightId, aufBriWechseln, warten, 40, 1);
                //+100ms warten
                warten += 100;


                UtilityService.delayed(lightId, aufBriWechseln, warten, 35, 0);
                //+100ms warten
                warten += 100;

                UtilityService.delayed(lightId, aufBriWechseln, warten, 40, 1);
                //+100ms warten
                warten += 100;

                UtilityService.delayed(lightId, aufBriWechseln, warten, 35, 0);
                //+100ms warten
                warten += 100;


                UtilityService.delayed(lightId, ausgangszustand, warten);
            };

            var rand = UtilityService.getRandomInt(1, 10);
            if (rand === 1)
                dunklesFlackern();
            if (rand === 2)
                hellerAusreisser();
            if (rand === 3 || rand === 4 | rand === 5)
                doppeltesFlackern();
            if (rand === 6)
                flimmern();
            if (rand === 7)
                ganzSchnellesFlimmern();
        };



        this.auroraEffect = function (lightId, gamut) {
            UtilityService.resetTimeoutForId(lightId);

            console.log("auroraEffect", lightId, gamut);


            var standard = function () {
                var warten = 0;

                var state1 = function () {
                    HueService.changeLightState(lightId, {
                        bri: 40,
                        xy: dark_purple["gamut" + gamut + "xy"],
                        transitiontime: 10
                    });
                };

                var state2 = function () {
                    HueService.changeLightState(lightId, {
                        bri: 45,
                        xy: green["gamut" + gamut + "xy"],
                        transitiontime: 20
                    });
                };

                var state3 = function () {
                    HueService.changeLightState(lightId, {
                        bri: 40,
                        hue_inc: -1000,
                        transitiontime: 10
                    });
                };

                var state4 = function () {
                    HueService.changeLightState(lightId, {
                        bri: 35,
                        hue_inc: +1000,
                        transitiontime: 10
                    });
                };

                var state5 = function () {
                    HueService.changeLightState(lightId, {
                        bri: 35,
                        xy: dark_blue_nightSky["gamut" + gamut + "xy"],
                        transitiontime: 20
                    });
                };

                var state6 = function () {
                    HueService.changeLightState(lightId, {
                        bri: 40,
                        hue_inc: -1000,
                        transitiontime: 10
                    });
                };

                var state7 = function () {
                    HueService.changeLightState(lightId, {
                        bri: 42,
                        hue_inc: 1000,
                        transitiontime: 10
                    });
                };

                UtilityService.delayed(lightId, state1, warten);
                warten += 1000;

                UtilityService.delayed(lightId, state2, warten);
                warten += 2000;

                UtilityService.delayed(lightId, state3, warten);
                warten += 1000;

                UtilityService.delayed(lightId, state4, warten);
                warten += 1000;

                UtilityService.delayed(lightId, state5, warten);
                warten += 2000;

                UtilityService.delayed(lightId, state6, warten);
                warten += 1000;

                UtilityService.delayed(lightId, state7, warten);
                warten += 1000;
            };

            standard();
        };

        return this;
    };

    factory.$inject = ['$interval', '$timeout', 'HueService', 'ColorService', 'DataService', 'LightCommandService', 'UtilityService'];
    return factory;
});
