/*global define, console, window,localStorage,angular,ColorThief,document*/

define(function () {
    'use strict';

    function ctrl($ionicPopover, $ionicModal, $scope, HueService, ColorService, DataService, UtilityService) {

        DataService.getEnrichedLightInfos().then(function (allLights) {

            $scope.allLights = allLights;
        });

        $scope.copySelection = {};
        $scope.activeLights = [];
        $scope.hexPalette = [{
            lightIdActive: null,
            hexColor: '#fff'
        }];
        $scope.options = {
            useRealBrightness: false,
            useAdaptiveBrightness: false
        };

        var isPointInTriangle = function (xy, gamut) {
            var Red = [1.0, 0.0];
            var Green = [0.0, 1.0];
            var Blue = [0.0, 0.0];

            if (gamut === "A") {
                Red = [0.704, 0.296];
                Green = [0.2151, 0.7106];
                Blue = [0.138, 0.08];
            } else if (gamut === "B") {
                Red = [0.675, 0.322];
                Green = [0.4091, 0.518];
                Blue = [0.167, 0.04];
            } else if (gamut === "C") {
                Red = [0.692, 0.308];
                Green = [0.17, 0.7];
                Blue = [0.153, 0.048];
            }

            function ptInTriangle(p, p0, p1, p2) {
                var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
                var sign = A < 0 ? -1 : 1;
                var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
                var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

                return s > 0 && t > 0 && (s + t) < 2 * A * sign;
            }

            function arrayToXyObject(xyArray) {
                return {
                    'x': xyArray[0],
                    'y': xyArray[1]
                };
            }

            return ptInTriangle(
                arrayToXyObject(xy),
                arrayToXyObject(Red),
                arrayToXyObject(Green),
                arrayToXyObject(Blue)
            );
        };

        var getImageBrightness = function (image) {
            var colorThief1 = new ColorThief();
            var palette1 = colorThief1.getPalette(image, 100, 2);
            var lightnessPercentage1 = 0;
            var lightnessPercentage2 = 0;
            angular.forEach(palette1, function (rgb) {
                var hex = ColorService.rgbToHex(rgb[0], rgb[1], rgb[2]);
                var hsl = ColorService.hexToHsl(hex);
                var border = 40;
                if (hsl.l < border) {
                    var correction = 15;
                    var newVal = hsl.l - correction;
                    if (newVal < 0) newVal = 0;
                    lightnessPercentage2 += newVal;
                } else if (hsl.l > border) {
                    var correction2 = 40;
                    var newVal2 = hsl.l + correction2;
                    if (newVal2 > 100) newVal2 = 100;
                    lightnessPercentage2 += newVal2;
                } else {
                    lightnessPercentage2 += hsl.l;
                }
                lightnessPercentage1 += hsl.l;
            });

            lightnessPercentage1 = lightnessPercentage1 / palette1.length;
            lightnessPercentage2 = lightnessPercentage2 / palette1.length;
            var bri = parseInt((lightnessPercentage1 / 100) * 254);
            var manipulatedBri = parseInt((lightnessPercentage2 / 100) * 254);






            return {
                bri: bri,
                manipulatedBri: manipulatedBri
            };
        };

        $scope.loadImage = function () {
            UtilityService.getPictureAlbumAsDataUrl().then(function (data) {

                var image = document.getElementById("imageSource");
                image.onload = function () {

                    var isGamutAInSelection = false;
                    var isGamutBInSelection = false;
                    var isGamutCInSelection = false;

                    for (var m = 0; m < $scope.activeLights.length; m++) {
                        var gamut = $scope.allLights[parseInt($scope.activeLights[m])].gamut;
                        if (gamut === "A") {
                            isGamutAInSelection = true;
                        } else if (gamut === "B") {
                            isGamutBInSelection = true;
                        } else if (gamut === "C") {
                            isGamutCInSelection = true;
                        }
                    }

                    var image = this;
                    var bri = getImageBrightness(image);
                    if ($scope.options.useRealBrightness) {
                        bri = bri.bri;
                    }
                    if ($scope.options.useAdaptiveBrightness) {
                        bri = bri.manipulatedBri;
                    }

                    var colorThief = new ColorThief();
                    var palette = colorThief.getPalette(image, 20, 6);
                    var hexPalette = [];

                    angular.forEach(palette, function (rgb) {
                        var hex = ColorService.rgbToHex(rgb[0], rgb[1], rgb[2]);
                        var hsl = ColorService.hexToHsl(hex);
                        var rawxy = ColorService.getRawXYPointFromRGB(rgb);

                        var item = {
                            lightIdActive: null,
                            hexColor: "#" + hex,
                            hsl: hsl,
                            isReachableByGamutA: isPointInTriangle(rawxy, "A"),
                            isReachableByGamutB: isPointInTriangle(rawxy, "B"),
                            isReachableByGamutC: isPointInTriangle(rawxy, "C"),
                        };

                        //hexPalette.push(item);
                        if (item.hsl.l > 35 && item.hsl.s > 60
                            //&& (
                            //    item.isReachableByGamutA ||
                            //    item.isReachableByGamutB ||
                            //    item.isReachableByGamutC)
                        ) {
                            hexPalette.push(item);
                        }
                    });

                    $scope.hexPalette = hexPalette;


                    var lightsActivated = {};

                    for (var i = 0; i < $scope.activeLights.length; i++) {
                        var gamutLight = $scope.allLights[parseInt($scope.activeLights[i])].gamut;

                        for (var j = 0; j < hexPalette.length; j++) {
                            if (hexPalette[j].lightIdActive === null && hexPalette[j]["isReachableByGamut" + gamutLight] === true) {

                                hexPalette[j].lightIdActive = $scope.activeLights[i];
                                lightsActivated[$scope.activeLights[i]] = true;

                                if ($scope.options.useRealBrightness || $scope.options.useAdaptiveBrightness) {

                                    HueService.changeLightState($scope.activeLights[i], {
                                        on: true,
                                        bri: bri
                                    });
                                } else {
                                    HueService.turnLightOnOff($scope.activeLights[i], true);
                                }

                                HueService.changeLightToHexColor($scope.activeLights[i], gamutLight, hexPalette[j].hexColor);

                                break;
                            }
                        }
                    }

                    if (Object.keys(lightsActivated).length < $scope.activeLights.length) {
                        var tmpIndex = 0;
                        for (var k = 0; k < $scope.activeLights.length; k++) {
                            var id = $scope.activeLights[k];
                            if (!(id in lightsActivated)) {

                                if ($scope.options.useRealBrightness || $scope.options.useAdaptiveBrightness) {
                                    HueService.changeLightState($scope.activeLights[k], {
                                        on: true,
                                        bri: bri
                                    });
                                } else {
                                    HueService.turnLightOnOff($scope.activeLights[k], true);
                                }
                                var gamutLight2 = $scope.allLights[parseInt($scope.activeLights[k])].gamut;

                                HueService.changeLightToHexColor($scope.activeLights[k], gamutLight2, hexPalette[tmpIndex].hexColor);
                                hexPalette[tmpIndex].lightIdActive = $scope.activeLights[k];
                                tmpIndex++;
                                if (tmpIndex === hexPalette.length) {
                                    tmpIndex = 0;
                                }
                            }
                        }
                    }

                };
                //$scope.myImage = "file://" + data;
                $scope.myImage = "data:image/jpeg;base64," + data;
            });
        };

        $scope.openModalLightSelection = function () {
            $ionicModal.fromTemplateUrl('copyto-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.copyToModal = modal;
                $scope.copyToModal.show();
            });
        };


        $scope.closeCopyToModal = function () {
            $scope.copyToModal.hide();
        };

        $scope.copyToSelection = function () {
            var selectedLights = [];
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    selectedLights.push(key);
                }
            });
            $scope.activeLights = selectedLights;

            $scope.closeCopyToModal();
        };

        $ionicPopover.fromTemplateUrl('options-popover.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (popover) {
            $scope.popover = popover;
        });
    }

    ctrl.$inject = ['$ionicPopover', '$ionicModal', '$scope', 'HueService', 'ColorService', 'DataService', 'UtilityService'];
    return ctrl;

});
