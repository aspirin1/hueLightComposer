/*global angular, define, console, window,navigator,alert*/
define(function () {
    'use strict';

    function ctrl($rootScope, $scope, $ionicLoading, $interval, $ionicModal, $ionicPopover, $filter, DataService, HueService, UtilityService, $q, ColorService) {
        console.info("HueLightDetailsCtrl init", $scope.lightId);



        var refreshLightInfo = function () {
            DataService.getEnrichedLightInfo($scope.lightId).then(function (data) {
                if (angular.isUndefined($scope.light)) {
                    $scope.light = data;
                } else {
                    $scope.light.state = data.state;
                    $scope.light.hexColor = data.hexColor;
                }
                $scope.brightnessOptions = {
                    start: [$scope.light.state.bri],
                    connect: 'lower',
                    step: 1,
                    range: {
                        'min': 1,
                        'max': 254
                    }
                };

                $scope.saturationOptions = {
                    start: [$scope.light.state.sat],
                    connect: 'lower',
                    step: 1,
                    range: {
                        'min': 1,
                        'max': 254
                    }
                };

                $scope.hueOptions = {
                    start: [$scope.light.state.hue],
                    connect: 'lower',
                    step: 500,
                    range: {
                        'min': 0,
                        'max': 65535
                    }
                };
            });
        };
        var refreshLightInBackground = $interval(refreshLightInfo, 3000, 0, true);
        refreshLightInfo();


        $scope.brightnessSliderEvents = {
            change: function (values, handle, unencoded) {
                var bri = parseInt(values[0][0]);
                HueService.changeBrightness($scope.lightId, bri);
            }
        };

        $scope.saturationSliderEvents = {
            change: function (values, handle, unencoded) {
                var sat = parseInt(values[0][0]);
                HueService.changeSaturation($scope.lightId, sat);
            }
        };

        $scope.hueSliderEvents = {
            change: function (values, handle, unencoded) {
                var hue = parseInt(values[0][0]);
                HueService.changeHue($scope.lightId, hue);
            }
        };

        DataService.getEnrichedLightInfos().then(function (data) {
            var tmp = [];
            angular.forEach(data, function (value, key) {
                if (key !== $scope.lightId) {
                    value.id = key;
                    tmp.push(value);
                }
            });
            $scope.allLightsExceptCurrent = tmp;
        });

        $scope.isEffectRunning = function () {
            var retVal = false;

            var eff = DataService.getEffect($scope.lightId);
            if (angular.isDefined(eff)) {
                retVal = true;
            }

            return retVal;
        };

        var unregisterEvent = $rootScope.$on('ColorChanged', function (event, color) {
            console.log(color);
            HueService.changeLightToHexColor($scope.lightId, $scope.light.gamut, color);
        });

        $scope.getEffectRunning = function () {
            var eff = DataService.getEffect($scope.lightId);
            if (angular.isUndefined(eff)) {
                return $filter('translate')('NO_EFFECT_RUNNING');
            } else {
                return $filter('translate')('Effect_' + eff.effect);
            }
        };

        $scope.stopEffect = function () {
            DataService.stopEffect($scope.lightId);
        };

        $scope.toggleLightOnOff = function () {
            if ($scope.light.state.on === false) {
                DataService.stopEffectAndTurnOffLight($scope.lightId);
            } else {
                HueService.turnLightOnOff($scope.lightId, $scope.light.state.on).then(function (data) {
                    refreshLightInfo();
                });
            }
        };

        $scope.getBrightnessPercentage = function (light) {
            if (typeof ($scope.light) !== "undefined") {
                var maxBri = 254.0;
                var lightBri = $scope.light.state.bri;
                return UtilityService.calculateFormattedPercentage(maxBri, lightBri);
            }
        };

        $scope.getSaturationPercentage = function (light) {
            if (typeof ($scope.light) !== "undefined") {
                var maxSat = 254.0;
                var lightBri = $scope.light.state.sat;
                return UtilityService.calculateFormattedPercentage(maxSat, lightBri);
            }
        };

        $scope.brightnessChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.bri;
                HueService.changeBrightness($scope.lightId, val);
            }
        };

        var reCalcColor = function (hue, sat) {
            //var sat = $scope.light.state.sat; //->l
            //var hue = $scope.light.state.hue; //->h

            var huePercentage = parseFloat(hue) / 65535.0;
            var satPercentage = parseFloat(sat) / 254.0;

            var s = 100;
            var h = 360 * huePercentage;
            var l = 50 + 50 * huePercentage;

            console.log(h, s, l);

            var hexColor = ColorService.hslToHex(h, s, l);
            console.log(hexColor);
            $scope.light.hexColor = hexColor;
        };

        $scope.saturationChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.sat;
                HueService.changeSaturation($scope.lightId, val).then(function (data) {
                    //reCalcColor();
                });
                //reCalcColor();
            }
        };

        $scope.hueChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.hue;
                HueService.changeHue($scope.lightId, val).then(function (data) {
                    //reCalcColor();
                });
                //reCalcColor();
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


        $ionicModal.fromTemplateUrl('rename-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.renameModal = modal;
        });

        $scope.openRenameModal = function () {
            $scope.renameModal.show();
        };
        $scope.closeModal = function () {
            $scope.renameModal.hide();
        };
        $scope.changeLightName = function (newName) {
            HueService.renameLight($scope.lightId, newName).then(function (data) {
                $scope.light.name = newName;
                $scope.modal.hide();
            });
        };


        $scope.getCopyToSelectedColorStyle = function () {
            if (!angular.isDefined($scope.modalColor))
                return {};
            return {
                'background-color': $scope.modalColor.hexColor
            };
        };


        $scope.copySelection = {};


        $scope.openCopyToModal = function () {
            getColorXy(5).then(function (data) {
                $scope.modalColor = data;

                $ionicModal.fromTemplateUrl('copyto-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.copyToModal = modal;
                    $scope.copyToModal.show();
                });
            });
        };

        var getColorXy = function (minSeks) {
            var deferred = $q.defer();

            var lightId = $scope.lightId;
            var attempts = 0;
            var xyFound, briFound, hexFound;

            $ionicLoading.show({
                template: 'Loading...'
            });

            var returnColor = function () {
                $interval.cancel(interval);
                $ionicLoading.hide();
                deferred.resolve({
                    xy: xyFound,
                    bri: briFound,
                    hexColor: hexFound
                });
            };

            var tryFindColor = function () {
                DataService.getEnrichedLightInfo(lightId).then(function (data) {
                    //$scope.light = data;
                    console.log(data.state.xy, attempts);
                    if (attempts === 0) {
                        xyFound = data.state.xy;
                        briFound = data.state.bri;
                        hexFound = data.hexColor;
                    }
                    if (attempts == minSeks) {
                        returnColor();
                        console.log("abbruch weil " + minSeks + " versuche");
                    }
                    if (attempts > 0 && (xyFound[0] !== data.state.xy[0] || xyFound[1] !== data.state.xy[1])) {
                        xyFound = data.state.xy;
                        briFound = data.state.bri;
                        hexFound = data.hexColor;
                        returnColor();
                        console.log("abbruch weil gefunden");
                    }
                    attempts++;
                });
            };

            var interval = $interval(tryFindColor, 1000);
            return deferred.promise;
        };

        $scope.closeCopyToModal = function () {
            $scope.copyToModal.hide();
        };

        $scope.copyToSelection = function () {
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    var mc = $scope.modalColor;
                    var light = $scope.light;

                    var gamutXy = ColorService.getGamutXyFromHex(light.gamut, mc.hexColor); //mc["gamut" + light.gamut];
                    HueService.changeLightState(key, {
                        on: true,
                        xy: gamutXy
                    });
                }
            });
            $scope.closeCopyToModal();
        };


        $scope.saveColor = function () {
            var lightId = $scope.lightId;

            getColorXy(10).then(function (data) {
                DataService.addCustomColor(data.hexColor);
            });

            //            navigator.notification.prompt(
            //                $filter('translate')('Home_LightList_Detail_SaveColor_Prompt_Text'), // message
            //                onPrompt, // callback to invoke
            //                $filter('translate')('Home_LightList_Detail_SaveColor_Prompt_Title'), // title
            //                [$filter('translate')('SINGLE_Ok'), $filter('translate')('SINGLE_Cancel')] // buttonLabels
            //            );
        };

        function onPrompt(results) {
            //OK
            if (results.buttonIndex === 1) {
                var colorName = results.input1;
                var lightId = $scope.lightId;


                getColorXy(lightId).then(function (data) {
                    DataService.addCustomColor(colorName, data.hexColor);
                    //console.info(data);
                    //var calculatedHex = ColorService.CIE1931ToHex("C", data.xy[0], data.xy[1], 255);
                    //console.info(data.hexColor, calculatedHex);
                });
            }
        }

        $ionicPopover.fromTemplateUrl('actions-popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $scope.$on("$destroy", function () {
            //$scope.renameModal.remove();
            //$scope.copyToModal.remove();
            unregisterEvent();
            $interval.cancel(refreshLightInBackground);
        });

    }

    ctrl.$inject = ['$rootScope', '$scope', '$ionicLoading', '$interval', '$ionicModal', '$ionicPopover', '$filter', 'DataService', 'HueService', 'UtilityService', '$q', 'ColorService'];
    return ctrl;

});
