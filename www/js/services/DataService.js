/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (HueService, $q, $interval, $timeout, ColorService, localStorageService) {
        var self = this;
        var loopState = {};
        var enrichedLightInfos = null;

        this.getCustomColors = function () {
            var tmp = localStorageService.get('customColors');
            return tmp;
        };

        this.addCustomColor = function (name, bri, sat, hue, hexColor) {
            var tmp = localStorageService.get('customColors');
            console.log(tmp);
            if (tmp === null)
                tmp = [];
            var newColor = {
                name: name,
                hue: hue,
                sat: sat,
                bri: bri,
                hexColor: hexColor
            };
            tmp.push(newColor);
            localStorageService.set('customColors', tmp);
        };

        this.getImageFromModelId = function (modelid) {
            if (typeof (modelid) === 'undefined' || modelid === null) {
                return "white_and_color_e27";
            }
            if (modelid === 'LCT001' ||
                modelid === 'LCT007' ||
                modelid === 'LCT010' ||
                modelid === 'LTW010' ||
                modelid === 'LWB004' ||
                modelid === 'LWB006'
            ) {
                return "white_and_color_e27";
            }
            if (modelid === 'LWB010' ||
                modelid === 'LWB014'
            ) {
                return "white_e27";
            }

            if (modelid === 'LST001' ||
                modelid === 'LST002'
            ) {
                return "lightstrip";
            }
            if (modelid === 'LLC020') {
                return "go";
            }
        };

        this.getGamutMode = function (modelid) {
            if (typeof (modelid) === 'undefined' || modelid === null) {
                return "X";
            }
            if (modelid === 'LCT001' ||
                modelid === 'LCT007' ||
                modelid === 'LCT002' ||
                modelid === 'LCT003' ||
                modelid === 'LLM001'
            ) {
                return "B";
            }
            if (modelid === 'LST001' ||
                modelid === 'LLC010' ||
                modelid === 'LLC011' ||
                modelid === 'LLC012' ||
                modelid === 'LLC006' ||
                modelid === 'LLC007' ||
                modelid === 'LLC013'
            ) {
                return "A";
            }

            if (modelid === 'LLC020' ||
                modelid === 'LST002'
            ) {
                return "C";
            }
            return "X";
        };

        this.getHexColor = function (gamut, xy, bri) {
            return "#" + ColorService.CIE1931ToHex(gamut, xy[0], xy[1], bri);
        };

        var getRefreshedLightInfos = function () {
            var deferred = $q.defer();
            HueService.getAllLights().then(function (lightInfos) {
                angular.forEach(lightInfos, function (value, key) {
                    value.image = self.getImageFromModelId(value.modelid);
                    value.gamut = self.getGamutMode(value.modelid);
                    value.hexColor = self.getHexColor(value.gamut, value.state.xy, value.state.bri);
                });
                console.log(lightInfos);
                deferred.resolve(lightInfos);
            });
            return deferred.promise;
        };



        this.getEnrichedLightInfo = function (lightId) {
            var deferred = $q.defer();

            HueService.getLightInfo(lightId).then(function (lightInfos) {
                lightInfos.image = self.getImageFromModelId(lightInfos.modelid);
                lightInfos.gamut = self.getGamutMode(lightInfos.modelid);
                lightInfos.hexColor = self.getHexColor(lightInfos.gamut, lightInfos.state.xy, lightInfos.state.bri);
                deferred.resolve(lightInfos);
            });

            return deferred.promise;
        };

        this.getEnrichedLightInfos = function (refresh) {
            var deferred = $q.defer();
            if (enrichedLightInfos === null || typeof (refresh !== 'undefined') && refresh) {
                console.info("refreshing light infos");
                getRefreshedLightInfos().then(function (data) {
                    enrichedLightInfos = data;
                    deferred.resolve(data);
                });
            } else {
                console.info(enrichedLightInfos);
                deferred.resolve(enrichedLightInfos);
            }
            return deferred.promise;
        };

        this.getEnrichedGroupInfos = function (refresh) {
            var deferred = $q.defer();
            HueService.getAllGroups().then(function (groups) {
                angular.forEach(groups, function (value, key) {

                });
                console.log(groups);
                deferred.resolve(groups);
            });
            return deferred.promise;
        };

        this.isLightLooping = function (lightId) {
            return (lightId in loopState);
        };

        this.stopLightLooping = function (lightId) {
            var q = $interval.cancel(loopState[lightId]);
            delete loopState[lightId];
            return q;
        };

        this.setLightLooping = function (lightId, interval) {
            loopState[lightId] = interval;
        };

        return this;
    };

    factory.$inject = ['HueService', '$q', '$interval', '$timeout', 'ColorService', 'localStorageService'];
    return factory;
});
