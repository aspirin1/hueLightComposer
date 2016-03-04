/*global define, console, cordova */

define(['angular'], function (angular) {
    "use strict";

    var factory = function () {
        this.getNewGuid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
        };

        this.getTime = function () {
            return (new Date()).getTime();
        };
        return this;
    };

    factory.$inject = [];
    return factory;
});
