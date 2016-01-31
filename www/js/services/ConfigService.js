/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (localStorageService) {

        var self = this;
        var bridgeUrl = null;
        var userId = null;
        var language = null;
        var design = null;


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
        this.getLanguage = function () {
            if (language === null)
                language = localStorageService.get('language');
            return language;
        };
        this.setLanguage = function (language) {
            language = language;
            localStorageService.set('language', language);
        };
        this.getDesign = function () {
            if (design === null)
                design = localStorageService.get('design');
            return design;
        };
        this.setDesign = function (tmp) {
            design = tmp;
            localStorageService.set('design', tmp);
        };
        return this;
    };

    factory.$inject = ['localStorageService'];
    return factory;
});
