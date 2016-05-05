/*global angular, define, console, window,navigator,alert*/
define(function () {
    'use strict';

    function ctrl($rootScope, $scope, $ionicLoading, $interval, $ionicModal, $ionicPopover, $filter, DataService, HueService, UtilityService, $q, ColorService) {


        var refreshLightInBackground;
        var unregisterEvent;

        $scope.$on("$ionicView.beforeEnter", function () {
            unregisterEvent = $rootScope.$on('ColorChanged', function (event, color) {
                HueService.changeLightToHexColor($scope.lightId, $scope.light.gamut, color);
            });
            refreshLightInfo();
            refreshLightInBackground = $interval(refreshLightInfo, 3000, 0, true);
        });

        $scope.$on("$destroy", function () {
            unregisterEvent();
            $interval.cancel(refreshLightInBackground);
        });

        $scope.$on('modal.removed', function (event, modal) {
            if (modal.id === "copyToModal") {
                $scope.popover.hide();
            }
        });

        var refreshLightInfo = function () {
            DataService.getEnrichedLightInfo($scope.lightId).then(function (data) {
                if (angular.isUndefined($scope.light)) {
                    $scope.light = data;
                } else {
                    $scope.light.state = data.state;

                    var nowTimestamp = (new Date()).getTime();
                    if (nowTimestamp - timestampForLastColorCalculation > 15000) //15s
                    {
                        $scope.light.hexColor = data.hexColor;
                    }
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
                reCalcColor($scope.light.state.hue, sat);
            }
        };

        $scope.hueSliderEvents = {
            change: function (values, handle, unencoded) {
                var hue = parseInt(values[0][0]);
                HueService.changeHue($scope.lightId, hue);
                reCalcColor(hue, $scope.light.state.sat);
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
            $scope.copyToLightsInSelection = tmp;
        });

        $scope.isEffectRunning = function () {
            var retVal = false;

            var eff = DataService.getEffect($scope.lightId);
            if (angular.isDefined(eff)) {
                retVal = true;
            }

            return retVal;
        };

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

        var timestampForLastColorCalculation = (new Date()).getTime();

        var reCalcColor = function (hue, sat) {
            $scope.light.hexColor = ColorService.hueSatToHex(hue, sat);
            timestampForLastColorCalculation = (new Date()).getTime();
        };

        $scope.saturationChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.sat;
                HueService.changeSaturation($scope.lightId, val).then(function (data) {});
            }
        };

        $scope.hueChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.hue;
                HueService.changeHue($scope.lightId, val).then(function (data) {});
            }
        };

        $scope.test = function () {
            reCalcColor($scope.light.state.hue, $scope.light.state.sat, $scope.light.state.bri);
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


            return css;
        };


        $scope.openRename = function () {
            function onPrompt(results) {
                if (results.buttonIndex === 1) {
                    var newName = results.input1;
                    HueService.renameLight($scope.lightId, newName).then(function (data) {
                        $scope.light.name = newName;
                    });
                }
            }

            navigator.notification.prompt(
                'Please enter a new name', // message
                onPrompt, // callback to invoke
                'Rename', // title
                ['Rename', 'Cancel'], // buttonLabels
                $scope.light.name // defaultText
            );
        };

        $scope.openCopyToModal = function () {
            getColorXy(10).then(function (data) {
                $scope.modalColor = data;

                $ionicModal.fromTemplateUrl('templates/home/modals/copyToModal.html', {
                    scope: $scope,
                    id: 'copyToModal',
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

                    if (attempts === 0) {
                        xyFound = data.state.xy;
                        briFound = data.state.bri;
                        hexFound = data.hexColor;
                    }
                    if (attempts == minSeks) {
                        returnColor();

                    }
                    if (attempts > 0 && (xyFound[0] !== data.state.xy[0] || xyFound[1] !== data.state.xy[1])) {
                        xyFound = data.state.xy;
                        briFound = data.state.bri;
                        hexFound = data.hexColor;
                        returnColor();

                    }
                    attempts++;
                });
            };

            var interval = $interval(tryFindColor, 1000);
            return deferred.promise;
        };



        $scope.saveColor = function () {
            var lightId = $scope.lightId;

            getColorXy(10).then(function (data) {
                DataService.addCustomColor(data.hexColor);
                navigator.notification.alert($filter('translate')('COLOR_SAVED'), null, $filter('translate')('COLOR_SAVED_TITLE'));
            });
        };

        function onPrompt(results) {
            //OK
            if (results.buttonIndex === 1) {
                var colorName = results.input1;
                var lightId = $scope.lightId;


                getColorXy(lightId).then(function (data) {
                    DataService.addCustomColor(colorName, data.hexColor);
                });
            }
        }

        $ionicPopover.fromTemplateUrl('actions-popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });



    }

    ctrl.$inject = ['$rootScope', '$scope', '$ionicLoading', '$interval', '$ionicModal', '$ionicPopover', '$filter', 'DataService', 'HueService', 'UtilityService', '$q', 'ColorService'];
    return ctrl;

});