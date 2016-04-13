/*global define, console, cordova */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (User, HelperService, HueService, $q, $interval, $timeout, ColorService, ColorDataService, localStorageService, DbService) {
        var self = this;
        var sceneImage = null;
        var sceneImageCropped = null;
        var effectState = {};
        var isStoppingState = {};
        var groupEffectState = {};
        var enrichedLightInfos = null;
        var favoriteColorsKey = "favoriteColors";
        var customColorsKey = "customColors";
        var customScenesKey = "customScenes";
        var localHistoryKey = "localHistory";
        var lastSynchroKey = "lastSynchro";
        var lastClientChangeKey = "lastClientChange";

        this.getSceneImage = function () {
            return sceneImage;
        };

        this.setSceneImage = function (imageFileName) {
            sceneImage = imageFileName;
        };

        this.getSceneImageCropped = function () {
            return sceneImageCropped;
        };

        this.setSceneImageCropped = function (imageFileName) {
            sceneImageCropped = imageFileName;
        };

        this.isUserLoggedIn = function () {
            return User.getUserAuthData() !== null;
        };

        this.addToLocalHistory = function (type, crud, uid) {
            var tmp = localStorageService.get(localHistoryKey);
            if (tmp === null)
                tmp = [];

            var newEntry = {
                'type': type,
                'crud': crud,
                'uid': uid,
                'time': HelperService.getTime()
            };

            tmp.push(newEntry);

            localStorageService.set(localHistoryKey, tmp);
            localStorageService.set(lastClientChangeKey, newEntry.time);
        };

        this.addCustomScene = function (id, name, lights, imageData) {
            var tmp = localStorageService.get(customScenesKey);
            if (tmp === null)
                tmp = {};

            var image = null;
            if (angular.isDefined(imageData) && imageData !== null) {
                image = HelperService.getNewGuid();
                DbService.insertImage(image, imageData);
            }

            var newScene = {
                'uid': HelperService.getNewGuid(),
                'changedAt': HelperService.getTime(),
                'id': id,
                'name': name,
                'lights': lights,
                'image': image
            };

            tmp[newScene.uid] = newScene;
            self.addToLocalHistory('scene', 'create', newScene.uid);

            localStorageService.set(customScenesKey, tmp);
            User.triggerUserChange();
        };

        this.removeCustomScene = function (id) {
            var tmp = localStorageService.get(customScenesKey);
            if (tmp === null)
                tmp = {};

            var tmpNew = {};
            angular.forEach(tmp, function (scene, key) {
                if (scene.id !== id) {
                    tmpNew[key] = scene;
                } else {
                    self.addToLocalHistory('scene', 'delete', scene.uid);
                }
            });

            localStorageService.set(customScenesKey, tmpNew);
            User.triggerUserChange();
        };

        this.getCustomScenes = function () {
            var tmp = localStorageService.get(customScenesKey);
            if (tmp === null)
                tmp = {};

            var ret = [];
            angular.forEach(tmp, function (value, key) {
                ret.push(value);
            });
            return ret;
        };


        this.isColorFavorite = function (hexColor) {
            var searchText = hexColor;
            if (searchText.length === 7)
                searchText = searchText.substring(1);

            var tmp = localStorageService.get(favoriteColorsKey);
            if (tmp === null)
                tmp = {};
            return angular.isDefined(tmp[searchText]);
        };

        this.getFavorites = function () {
            var tmp = localStorageService.get(favoriteColorsKey);
            if (tmp === null)
                tmp = {};

            var ret = [];
            angular.forEach(tmp, function (value, key) {
                ret.push(value.hexColor);
            });
            return ret;
        };

        this.toggleFavorite = function (hexColor) {
            var searchText = hexColor;
            if (searchText.length === 7)
                searchText = searchText.substring(1);

            var tmp = localStorageService.get(favoriteColorsKey);
            if (tmp === null)
                tmp = {};

            if (angular.isDefined(tmp[searchText])) {
                self.addToLocalHistory('favorite', 'delete', searchText);
                delete tmp[searchText];
            } else {
                tmp[searchText] = {
                    'uid': HelperService.getNewGuid(),
                    'changedAt': HelperService.getTime(),
                    'hexColor': hexColor
                };
                self.addToLocalHistory('favorite', 'create', searchText);
            }

            localStorageService.set(favoriteColorsKey, tmp);
            User.triggerUserChange();
        };






        this.calc = function () {

            //v0=b
            //v1=r
            //v2=g
            var doCalc = function (rasterSize, v0x, v0y, v1x, v1y, v2x, v2y) {

                var orient2d = function (aX, aY, bX, bY, cX, cY) {
                    return (bX - aX) * (cY - aY) - (bY - aY) * (cX - aX);
                };

                var min3 = function (v0x, v1x, v2x) {
                    var retVal = v0x;
                    if (v1x < retVal)
                        retVal = v1x;
                    if (v2x < retVal)
                        retVal = v1x;
                    return retVal;
                };

                var max3 = function (v0x, v1x, v2x) {
                    var retVal = v0x;
                    if (v1x > retVal)
                        retVal = v1x;
                    if (v2x > retVal)
                        retVal = v1x;
                    return retVal;
                };

                var min = function (a, b) {
                    return (a > b) ? a : b;
                };

                var max = function (a, b) {
                    return (a < b) ? b : a;
                };

                var count = 0;
                var tmp = {};
                var renderPixel = function (xy) {
                    count++;
                    var hexColor = "#" + ColorService.CIE1931ToHex("C", xy[0], xy[1], 1);
                    if (!(hexColor in tmp))
                        tmp[hexColor] = true;
                };

                // Compute triangle bounding box
                var minX = min3(v0x, v1x, v2x);
                var minY = min3(v0y, v1y, v2y);
                var maxX = max3(v0x, v1x, v2x);
                var maxY = max3(v0y, v1y, v2y);

                // Clip against screen bounds
                minX = max(minX, 0);
                minY = max(minY, 0);
                maxX = min(maxX, 0.9);
                maxY = min(maxY, 0.9);

                var px, py;
                for (py = minY; py <= maxY; py = py + rasterSize) {
                    for (px = minX; px <= maxX; px = px + rasterSize) {
                        // Determine barycentric coordinates
                        var w0 = orient2d(v1x, v1y, v2x, v2y, px, py);
                        var w1 = orient2d(v2x, v2y, v0x, v0y, px, py);
                        var w2 = orient2d(v0x, v0y, v1x, v1y, px, py);

                        // If p is on or inside all edges, render pixel.
                        if (w0 >= 0 && w1 >= 0 && w2 >= 0)
                            renderPixel([px, py]);
                    }
                }

                var retArray = [];
                angular.forEach(tmp, function (value, key) {
                    retArray.push(key);
                });

                return retArray;
            };

            var Red = [1.0, 0.0];
            var Green = [0.0, 1.0];
            var Blue = [0.0, 0.0];

            var initGamutA = function () {
                    Red = [0.704, 0.296];
                    Green = [0.2151, 0.7106];
                    Blue = [0.138, 0.08];
                },
                initGamutB = function () {
                    Red = [0.675, 0.322];
                    Green = [0.4091, 0.518];
                    Blue = [0.167, 0.04];
                },
                initGamutC = function () {
                    Red = [0.692, 0.308];
                    Green = [0.17, 0.7];
                    Blue = [0.153, 0.048];
                };

            initGamutC();
            return doCalc(0.02, Blue[0], Blue[1], Red[0], Red[1], Green[0], Green[1]);
        };

        this.getOwnColors = function () {
            var deferred = $q.defer();
            $timeout(function () {
                var allColors = [];

                var customColors = localStorageService.get(customColorsKey);

                angular.forEach(customColors, function (color, key) {
                    color.isCustom = true;
                    allColors.push(color);
                });

                deferred.resolve(allColors);
            }, 0);
            return deferred.promise;
        };


        this.getAllColors = function () {
            var deferred = $q.defer();
            $timeout(function () {
                var allColors = [];
                //var baseColors = ColorDataService.getColors();
                var baseColors = self.calc();
                console.log(baseColors);

                angular.forEach(baseColors, function (color) {
                    //color.isCustom = false;
                    //allColors.push(color);
                    allColors.push({
                        hexColor: color,
                        isCustom: false
                    });
                });

                var customColors = localStorageService.get(customColorsKey);

                angular.forEach(customColors, function (color, key) {
                    color.isCustom = true;
                    allColors.push(color);
                });

                angular.forEach(allColors, function (color) {
                    color.isFavorite = self.isColorFavorite(color.hexColor);

                    var rawxy = ColorService.getRawXYPointFromRGB(ColorService.hexToRgb(color.hexColor));
                    color.isReachableByGamutA = ColorService.checkPointInLampsReach("A", rawxy);
                    color.isReachableByGamutB = ColorService.checkPointInLampsReach("B", rawxy);
                    color.isReachableByGamutC = ColorService.checkPointInLampsReach("C", rawxy);
                    color.hsl = ColorService.hexToHsl(color.hexColor);
                });

                deferred.resolve(allColors);
            }, 0);
            return deferred.promise;
        };

        this.addCustomColor = function (hexColor) {
            var tmp = localStorageService.get(customColorsKey);
            if (tmp === null)
                tmp = {};

            var newColor = {
                'uid': HelperService.getNewGuid(),
                'changedAt': HelperService.getTime(),
                'hexColor': hexColor
            };

            var containsColorAlready = false;
            angular.forEach(tmp, function (color, key) {
                if (color.hexColor === hexColor) {
                    containsColorAlready = true;
                    return;
                }
            });

            if (containsColorAlready === false) {
                tmp[newColor.uid] = newColor;
                self.addToLocalHistory('color', 'create', newColor.uid);
            }

            localStorageService.set(customColorsKey, tmp);
            User.triggerUserChange();
        };


        this.removeCustomColor = function (hexColor) {
            var tmp = localStorageService.get(customColorsKey);
            if (tmp === null)
                tmp = {};

            var tmpNew = {};
            angular.forEach(tmp, function (color, key) {
                if (color.hexColor !== hexColor) {
                    tmpNew[key] = color;
                } else {
                    self.addToLocalHistory('color', 'delete', color.uid);
                }
            });

            localStorageService.set(customColorsKey, tmpNew);
            User.triggerUserChange();
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
            if (modelid === "LLC001") {
                return "iris";
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
                modelid === 'LLC013' ||
                modelid === "LLC001"
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
            return "#" + ColorService.CIE1931ToHex(gamut, xy[0], xy[1], 1);
        };

        this.getLightById = function (key) {
            var id = parseInt(key);
            console.log(id, enrichedLightInfos);
            var light = enrichedLightInfos[id];
            light.id = id;
            return light;
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

        this.stopEffectByName = function (name) {
            angular.forEach(effectState, function (effect) {
                if (effect.effect === name) {
                    self.stopEffect(effect.lightId);
                }
            });
        };

        this.isEffectRunning = function (name) {
            var retVal = false;
            angular.forEach(effectState, function (effect) {
                if (effect.effect === name) {
                    retVal = true;
                    return;
                }
            });
            return retVal;
        };

        this.stopEffect = function (lightId) {
            var q;
            isStoppingState[parseInt(lightId)] = true;

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
                        angular.forEach(effect.timeouts, function (promise) {
                            $timeout.cancel(promise);
                        });
                        q = $interval.cancel(effect.interval);
                        delete effectState[parseInt(effect.lightId)];
                    }

                    if (angular.isDefined(cordova.plugins) && angular.isDefined(cordova.plugins.backgroundMode)) {
                        var effectsRunningCnt = Object.keys(effectState).length;
                        if (effectsRunningCnt === 0) {
                            cordova.plugins.backgroundMode.disable();
                        } else {
                            cordova.plugins.backgroundMode.configure({
                                text: effectsRunningCnt + "effects running"
                            });
                        }
                    }
                }
            });



            return q;
        };

        this.pushTimeout = function (lightId, promise) {
            var effect = effectState[parseInt(lightId)];
            if (angular.isDefined(effect)) {
                effect.timeouts.push(promise);
            }
        };

        this.resetTimeouts = function (lightId) {
            var effect = effectState[parseInt(lightId)];
            if (angular.isDefined(effect)) {
                effect.timeouts = [];
            }
        };

        this.isStopped = function (lightId) {
            return (lightId in isStoppingState);
        };

        this.setEffect = function (lightId, effectName, interval) {
            delete isStoppingState[lightId];

            effectState[parseInt(lightId)] = {
                type: "single",
                lightId: parseInt(lightId),
                associatedLights: [],
                effect: effectName,
                interval: interval,
                timeouts: []
            };

            if (angular.isDefined(cordova.plugins) && angular.isDefined(cordova.plugins.backgroundMode)) {
                var effectsRunningCnt = Object.keys(effectState).length;
                cordova.plugins.backgroundMode.configure({
                    title: "Hue light composer",
                    ticker: "Ticker Hue light composer Hue light composer",
                    text: effectsRunningCnt + " effects running"
                });
                cordova.plugins.backgroundMode.enable();
            }
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
            HueService.turnLightOnOff(lightId, false);
        };
        return this;
    };

    factory.$inject = ['User', 'HelperService', 'HueService', '$q', '$interval', '$timeout', 'ColorService', 'ColorDataService', 'localStorageService', 'DbService'];
    return factory;
});