/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($filter, $timeout, DataService) {
        var self = this;

        this.round = function (value, decimals) {
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        };

        this.getRandomXy = function (minX, maxX, minY, maxY) {
            var x = self.getRandomArbitrary(minX, maxX),
                y = self.getRandomArbitrary(minY, maxY);
            return [x, y];
        };

        /**
         * Returns a random number between min (inclusive) and max (exclusive)
         */
        this.getRandomArbitrary = function (min, max) {
            return self.round(Math.random() * (max - min) + min, 5);
        };

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give you a non-uniform distribution!
         */
        this.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        this.msToTransitionTime = function (time) {
            return parseInt(time / 100);
        };

        this.delayed = function (lightId, func, delay, arg0, arg1, arg2, arg3, arg4, arg5) {
            if (!DataService.isStopped(lightId))
                DataService.pushTimeout(lightId, $timeout(func, delay, false, arg0, arg1, arg2, arg3, arg4, arg5));
        };

        this.resetTimeoutForId = function (lightId) {
            DataService.resetTimeouts(lightId);
        };

        this.calculateFormattedPercentage = function (max, current) {
            var percentage = current / max;
            var formattedPercentage = Math.round(percentage * 100);
            return formattedPercentage + " %";
        };


        this.getEffectRunningText = function (allLights, lightId) {
            if (allLights.length > 0) {
                var eff = DataService.getEffect(lightId);
                if (angular.isUndefined(eff)) {
                    return $filter('translate')('NO_EFFECT_RUNNING');
                } else {
                    return $filter('translate')('Effect_' + eff.effect);
                }
            }
            return "";
        };

        return this;
    };

    factory.$inject = ["$filter", "$timeout", "DataService"];
    return factory;
});
