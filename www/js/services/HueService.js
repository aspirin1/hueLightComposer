/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($http, ConfigService) {

        var getBaseApiUrl = function () {
            return ConfigService.getBridgeUrl() + '/api/' + ConfigService.getUserId();
        };

        var logError = function (result) {
            console.error(result);
        };

        this.getBridgeInfo = function () {
            return $http.get('https://www.meethue.com/api/nupnp')
                .then(function (result) {
                    return result.data;
                });
        };

        this.createUser = function () {
            return $http.post(ConfigService.getBridgeUrl() + '/api', {
                    "devicetype": "hueLightComposer#testName"
                })
                .then(function (result) {
                    return result.data;
                });
        };

        this.getAllLights = function () {
            console.log(getBaseApiUrl() + '/lights');
            return $http.get(getBaseApiUrl() + '/lights')
                .then(function (result) {
                    return result.data;
                });
        };

        this.getLightInfo = function (lightId) {
            var url = getBaseApiUrl() + '/lights/' + lightId;
            console.log(url);
            return $http.get(url)
                .then(function (result) {
                    return result.data;
                });
        };

        this.changeLightState = function (lightId, newState) {
            var url = getBaseApiUrl() + '/lights/' + lightId + '/state';
            var cmd = JSON.stringify(newState);
            console.info(url, cmd);
            return $http.put(url, cmd)
                .then(function (result) {
                    console.log(result);
                    return result.data;
                });
        };

        this.turnLightOnOff = function (lightId, newState) {
            var obj = {
                on: newState
            };
            return this.changeLightState(lightId, obj);
        };

        this.changeBrightness = function (lightId, newState) {
            var obj = {
                bri: parseInt(newState)
            };
            return this.changeLightState(lightId, obj);
        };

        this.changeSaturation = function (lightId, newState) {
            var obj = {
                sat: parseInt(newState)
            };
            return this.changeLightState(lightId, obj);
        };

        this.changeHue = function (lightId, newState) {
            var obj = {
                hue: parseInt(newState)
            };
            return this.changeLightState(lightId, obj);
        };

        this.toggleColorloop = function (lightId, doColorLoop) {
            var cmd = "none";
            if (doColorLoop) {
                cmd = "colorloop";
            }

            var obj = {
                on: true,
                effect: cmd
            };
            return this.changeLightState(lightId, obj);
        };

        this.getAllGroups = function () {
            var url = getBaseApiUrl() + '/groups';
            console.log(url);
            return $http.get(url)
                .then(function (result) {
                    return result.data;
                });
        };

        this.changeGroupState = function (groupId, newState) {
            var url = getBaseApiUrl() + '/groups/' + groupId + '/action';
            var cmd = JSON.stringify(newState);
            console.info(url, cmd);
            return $http.put(url, cmd)
                .then(function (result) {
                    console.log(result);
                    return result.data;
                });
        };

        this.turnGroupOnOff = function (groupId, newState) {
            var obj = {
                on: newState
            };
            return this.changeGroupState(groupId, obj);
        };

        this.getAllScenes = function () {
            var url = getBaseApiUrl() + '/scenes';
            console.log(url);
            return $http.get(url)
                .then(function (result) {
                    return result.data;
                });
        };

        this.recallScene = function (sceneId) {
            var obj = {
                scene: sceneId
            };
            return this.changeGroupState(0, obj);
        };

        return this;
    };

    factory.$inject = ['$http', 'ConfigService'];
    return factory;
});
