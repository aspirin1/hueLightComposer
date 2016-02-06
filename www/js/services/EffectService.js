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

        this.candleEffect = function (lightId) {
            var minBri = 36,
                maxBri = 43,
                minX = 0.56,
                maxX = 0.575,
                minY = 0.382,
                maxY = 0.39;

            var getRandomXy = function () {
                var x = getRandomArbitrary(minX, maxX),
                    y = getRandomArbitrary(minY, maxY);
                return [x, y];
            };

            var ausgangszustand = function () {
                HueService.changeLightState(lightId, {
                    bri: getRandomInt(38, 42),
                    //xy: [0.5676, 0.3877],
                    xy: getRandomXy(),
                    transitiontime: getRandomInt(1, 3)
                });
            };

            var steilAbfallen = function (minBri, maxBri) {
                HueService.changeLightState(lightId, {
                    bri: getRandomInt(minBri, maxBri),
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
                HueService.changeLightState(lightId, {
                    bri: getRandomInt(34, 36),
                    transitiontime: 1,
                    xy: getRandomXy()
                });
                $timeout(ausgangszustand, 200, false);
            };

            var hellerAusreisser = function () {
                console.log('hellerAusreisser');
                HueService.changeLightState(lightId, {
                    bri: getRandomInt(43, 46),
                    transitiontime: 4,
                    xy: getRandomXy()
                });
                $timeout(ausgangszustand, 500, false);
            };

            var doppeltesFlackern = function () {
                console.log('doppeltesFlackern');
                steilAbfallen(35, 35); //100ms
                //+300ms warten
                $timeout(aufBriWechseln, 400, false, 40, 3); //300ms
                //+100ms warten
                $timeout(steilAbfallen, 800, false, 37, 37); //100ms
                //+300ms warten
                $timeout(ausgangszustand, 1200, false);
            };

            var flimmern = function () {
                console.log('flimmern');
                aufBriWechseln(35, 0); //100ms
                //+200ms warten
                $timeout(aufBriWechseln, 300, false, 38, 0); //100ms
                //+200ms warten
                $timeout(aufBriWechseln, 600, false, 36, 0); //100ms
                //+200ms warten
                $timeout(aufBriWechseln, 900, false, 39, 0); //100ms
                //+200ms warten
                $timeout(ausgangszustand, 1200, false);
            };

            var ganzSchnellesFlimmern = function () {
                console.log('ganzSchnellesFlimmern');
                var warten = 0;

                aufBriWechseln(35, 0);
                //+100ms warten
                warten += 100;

                $timeout(aufBriWechseln, warten, false, 40, 1);
                //+100ms warten
                warten += 100;

                $timeout(aufBriWechseln, warten, false, 35, 0);
                //+100ms warten
                warten += 100;

                $timeout(aufBriWechseln, warten, false, 40, 1);
                //+100ms warten
                warten += 100;



                $timeout(aufBriWechseln, warten, false, 35, 0);
                //+100ms warten
                warten += 100;

                $timeout(aufBriWechseln, warten, false, 40, 1);
                //+100ms warten
                warten += 100;

                $timeout(aufBriWechseln, warten, false, 35, 0);
                //+100ms warten
                warten += 100;


                $timeout(ausgangszustand, warten, false);
            };

            var rand = getRandomInt(1, 10);
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

        var dark_red = ColorService.getXysFromHex("#54001c");
        var dark_purple = ColorService.getXysFromHex("#2c1b3d");
        var light_purple = ColorService.getXysFromHex("#902aaa");
        var green = ColorService.getXysFromHex("#1f8a20");
        var dark_blue_nightSky = ColorService.getXysFromHex("#1e228d");
        var turquois = ColorService.getXysFromHex("#3cd5c0");

        this.auroraEffect = function (lightId, gamut) {
            console.log("auroraEffect", lightId, gamut);
            var ausgangszustand = function () {
                HueService.changeLightState(lightId, {
                    bri: getRandomInt(40, 55),
                    xy: dark_blue_nightSky["gamut" + gamut + "xy"],
                    transitiontime: getRandomInt(10)
                });
            };

            var aufGruenWechseln = function () {
                HueService.changeLightState(lightId, {
                    bri: getRandomInt(40, 50),
                    xy: green["gamut" + gamut + "xy"],
                    transitiontime: getRandomInt(10, 30)
                });
            };

            var aufDunklesLilaWechseln = function () {
                HueService.changeLightState(lightId, {
                    bri: getRandomInt(40, 50),
                    xy: dark_purple["gamut" + gamut + "xy"],
                    transitiontime: getRandomInt(10, 30)
                });
            };

            var aufHellesLilaWechseln = function () {
                HueService.changeLightState(lightId, {
                    bri: getRandomInt(40, 50),
                    xy: light_purple["gamut" + gamut + "xy"],
                    transitiontime: getRandomInt(10, 30)
                });
            };

            var standard = function () {
                console.log('standard');
                var warten = 0;
                HueService.changeLightState(lightId, {
                    bri: 40,
                    xy: dark_purple["gamut" + gamut + "xy"],
                    transitiontime: 10
                });
                warten += 1000;

                $timeout(function () {
                    HueService.changeLightState(lightId, {
                        bri: 45,
                        xy: green["gamut" + gamut + "xy"],
                        transitiontime: 20
                    });
                }, warten, false);
                warten += 2000;

                $timeout(function () {
                    HueService.changeLightState(lightId, {
                        bri: 40,
                        hue_inc: -1000,
                        transitiontime: 10
                    });
                }, warten, false);
                warten += 1000;

                $timeout(function () {
                    HueService.changeLightState(lightId, {
                        bri: 35,
                        hue_inc: +1000,
                        transitiontime: 10
                    });
                }, warten, false);
                warten += 1000;

                HueService.changeLightState(lightId, {
                    bri: 40,
                    xy: dark_purple["gamut" + gamut + "xy"],
                    transitiontime: 20
                });
                warten += 2000;

                $timeout(function () {
                    HueService.changeLightState(lightId, {
                        bri: 35,
                        xy: dark_blue_nightSky["gamut" + gamut + "xy"],
                        transitiontime: 20
                    });
                }, warten, false);
                warten += 2000;

                $timeout(function () {
                    HueService.changeLightState(lightId, {
                        bri: 40,
                        hue_inc: -1000,
                        transitiontime: 10
                    });
                }, warten, false);
                warten += 1000;

                $timeout(function () {
                    HueService.changeLightState(lightId, {
                        bri: 42,
                        hue_inc: 1000,
                        transitiontime: 10
                    });
                }, warten, false);
                warten += 1000;
                console.log('standard finished in:' + warten + 'ms');
            };

            //var rand = getRandomInt(1, 2);
            //if (rand === 1)
            standard();
        };

        this.auroraFestEffect = function (lights, gamut) {
            console.log("auroraFestEffect", lights, gamut);



            var lilaAni = function (lichtId, warten) {
                $timeout(function () {
                    HueService.changeLightState(lichtId, {
                        bri: 35,
                        xy: dark_purple["gamut" + gamut + "xy"],
                        transitiontime: 50
                    });
                }, warten, false);
                warten += 5000;

                $timeout(function () {
                    HueService.changeLightState(lichtId, {
                        bri: 40,
                        transitiontime: 40
                    });
                }, warten, false);
                warten += 4000;

                $timeout(function () {
                    HueService.changeLightState(lichtId, {
                        bri: 35,
                        hue_inc: 2000,
                        transitiontime: 30
                    });
                }, warten, false);
                warten += 3000;

                $timeout(function () {
                    HueService.changeLightState(lichtId, {
                        bri: 35,
                        hue_inc: -2000,
                        transitiontime: 30
                    });
                }, warten, false);
                warten += 3000;
            };

            var blauAni = function (lichtId, warten) {
                $timeout(function () {
                    HueService.changeLightState(lichtId, {
                        bri: 35,
                        xy: dark_blue_nightSky["gamut" + gamut + "xy"],
                        transitiontime: 50
                    });
                }, warten, false);
                warten += 5000;

                $timeout(function () {
                    HueService.changeLightState(lichtId, {
                        bri: 40,
                        xy: dark_blue_nightSky["gamut" + gamut + "xy"],
                        transitiontime: 40
                    });
                }, warten, false);
                warten += 4000;

                $timeout(function () {
                    HueService.changeLightState(lichtId, {
                        bri: 35,
                        hue_inc: 2000,
                        transitiontime: 30
                    });
                }, warten, false);
                warten += 3000;

                $timeout(function () {
                    HueService.changeLightState(lichtId, {
                        bri: 35,
                        hue_inc: -2000,
                        transitiontime: 30
                    });
                }, warten, false);
                warten += 3000;
            };

            var lilaZuBlau = function (lichtId) {
                lilaAni(lichtId, 0);
                blauAni(lichtId, 15000);
            };

            var blauZuLila2 = function (lichtId) {
                blauAni(lichtId, 0);
                lilaAni(lichtId, 15000);
            };

            blauZuLila2(lights[0]);
            lilaZuBlau(lights[1]);
            blauZuLila2(lights[2]);
        };

        return this;
    };

    factory.$inject = ['$timeout', 'HueService', 'ColorService'];
    return factory;
});
