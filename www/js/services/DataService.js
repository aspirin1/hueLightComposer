/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (HueService, $q, $interval, $timeout, ColorService, ColorDataService, localStorageService) {
        var self = this;
        var effectState = {};
        var groupEffectState = {};
        var enrichedLightInfos = null;

        this.getCustomColors = function () {
            var colors = ColorDataService.getColors();
            var testColor = colors[0];
            var gamutAxy = ColorService.rgbArrayToCIE1931("A", testColor.rgb);
            var gamutBxy = ColorService.rgbArrayToCIE1931("B", testColor.rgb);
            var gamutCxy = ColorService.rgbArrayToCIE1931("C", testColor.rgb);

            //console.log(testColor);
            console.log(gamutAxy, gamutBxy, gamutCxy);

            //var tmp = localStorageService.get('customColors');
            //return tmp;
            return colors;
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
                deferred.resolve(groups);
            });
            return deferred.promise;
        };


        var findEffect = function (lightId) {
            var tmp = [];
            angular.forEach(effectState, function (effect) {
                if (effect.lightId === parseInt(lightId)) {
                    if (effect.type === "group") {
                        angular.forEach(effect.lights, function (lightId) {
                            tmp.push(effectState[lightId]);
                        });
                    } else {
                        tmp.push(effectState[effect.lightId]);
                    }
                }
            });
            return tmp;
        };

        this.isLightExecutingEffect = function (lightId) {
            return (lightId in effectState);
        };

        this.isGroupExecutingEffect = function (groupId) {
            return (groupId in groupEffectState);
        };

        this.stopEffect = function (lightId) {
            var q;
            angular.forEach(effectState, function (effect) {
                if (effect.lightId === parseInt(lightId)) {
                    if (effect.type === "group") {
                        var groupId = parseInt(effect.groupId);
                        var lights = effect.lights;
                        q = $interval.cancel(groupEffectState[groupId].interval);
                        delete groupEffectState[groupId];

                        angular.forEach(effect.associatedLights, function (assocLightId) {
                            delete effectState[parseInt(assocLightId)];
                        });
                    } else {
                        q = $interval.cancel(effect.interval);
                        delete effectState[parseInt(effect.lightId)];
                    }
                }
            });
            console.info("effectState", effectState);
            console.info("groupEffectState", groupEffectState);
            return q;
        };

        this.setEffect = function (lightId, effectName, interval) {
            console.log("starting effect: " + effectName);
            effectState[parseInt(lightId)] = {
                type: "single",
                lightId: parseInt(lightId),
                associatedLights: [],
                effect: effectName,
                interval: interval,
            };
        };

        this.getEffect = function (lightId) {
            return effectState[parseInt(lightId)];
        };

        this.setGroupEffect = function (groupId, lights, effectName, interval) {
            angular.forEach(lights, function (lightId) {
                effectState[parseInt(lightId)] = {
                    type: "group",
                    lightId: parseInt(lightId),
                    groupId: parseInt(groupId),
                    associatedLights: lights,
                    effect: effectName,
                };
            });

            groupEffectState[parseInt(groupId)] = {
                groupId: parseInt(groupId),
                associatedLights: lights,
                effect: effectName,
                interval: interval
            };
        };

        this.setGroupLooping = function (lights, interval) {
            angular.forEach(lights, function (lightId) {
                effectState[lightId] = interval;
            });
        };

        this.stopEffectAndTurnOffLight = function (lightId) {
            self.stopEffect(lightId);
            HueService.turnLightOnOff(lightId);
        };
        return this;
    };

    factory.$inject = ['HueService', '$q', '$interval', '$timeout', 'ColorService', 'ColorDataService', 'localStorageService'];
    return factory;
});
