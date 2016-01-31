/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function () {

        this.calculateFormattedPercentage = function (max, current) {
            var percentage = current / max;
            var formattedPercentage = Math.round(percentage * 100);
            return formattedPercentage + " %";
        };


        return this;
    };

    factory.$inject = [];
    return factory;
});
