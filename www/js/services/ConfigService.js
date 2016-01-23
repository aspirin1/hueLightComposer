/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (localStorageService) {

        var self = this;
        var bridgeUrl = null;
        var userId = null;


        this.getBridgeUrl = function () {
            if (bridgeUrl === null)
                bridgeUrl = localStorageService.get('bridgeIp');
            return bridgeUrl;
        };
        this.setBridgeUrl = function (url) {
            bridgeUrl = url;
            localStorageService.set('bridgeIp', url);
        };

        this.getUserId = function () {
            if (userId === null)
                userId = localStorageService.get('userId');
            return userId;
        };
        this.setUserId = function (userIdent) {
            userId = userIdent;
            localStorageService.set('userId', userIdent);
        };
        return this;
    };

    factory.$inject = ['localStorageService'];
    return factory;
});
