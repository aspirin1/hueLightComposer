/*global angular, define, console, window,navigator,alert*/
define(function () {
    'use strict';

    function ctrl($rootScope, $scope, $ionicLoading, $interval, $ionicModal, $ionicPopover, $filter, DataService, HueService, UtilityService, $q, ColorService) {
        console.info("HueLightDetailsCtrl init", $scope.lightId);



        var refreshLightInfo = function () {
            DataService.getEnrichedLightInfo($scope.lightId).then(function (data) {
                $scope.light = data;

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
        refreshLightInfo();


        $scope.brightnessSliderEvents = {
            change: function (values, handle, unencoded) {
                var bri = parseInt(values[0][0]);
                HueService.changeBrightness($scope.lightId, bri).then(refreshLightInfo);
            }
        };

        $scope.saturationSliderEvents = {
            change: function (values, handle, unencoded) {
                var sat = parseInt(values[0][0]);
                HueService.changeSaturation($scope.lightId, sat).then(refreshLightInfo);
            }
        };

        $scope.hueSliderEvents = {
            change: function (values, handle, unencoded) {
                var hue = parseInt(values[0][0]);
                HueService.changeHue($scope.lightId, hue).then(refreshLightInfo);
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

        $scope.saturationChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.sat;
                HueService.changeSaturation($scope.lightId, val);
            }
        };

        $scope.hueChanged = function () {
            if (typeof ($scope.light) !== "undefined") {
                var val = $scope.light.state.hue;
                HueService.changeHue($scope.lightId, val);
            }
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
        $scope.$on('$destroy', function () {
            $scope.renameModal.remove();
            $scope.copyToModal.remove();
        });


        $scope.copySelection = {};
        $ionicModal.fromTemplateUrl('copyto-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.copyToModal = modal;
        });

        $scope.openCopyToModal = function () {
            $scope.copyToModal.show();
        };

        var getColorXy = function () {
            var deferred = $q.defer();

            var colorName = "test";
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
                    if (attempts == 10) {
                        returnColor();
                        console.log("abbruch weil 10 versuche");
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
                    HueService.changeLightState(key, {
                        bri: parseInt($scope.light.state.bri),
                        sat: parseInt($scope.light.state.sat),
                        hue: parseInt($scope.light.state.hue),
                    });
                }
            });
            $scope.closeCopyToModal();
        };


        $scope.saveColor = function () {
            var lightId = $scope.lightId;


            getColorXy(lightId).then(function (data) {
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
            unregisterEvent();
        });

    }

    ctrl.$inject = ['$rootScope', '$scope', '$ionicLoading', '$interval', '$ionicModal', '$ionicPopover', '$filter', 'DataService', 'HueService', 'UtilityService', '$q', 'ColorService'];
    return ctrl;

});
