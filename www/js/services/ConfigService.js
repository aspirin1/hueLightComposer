/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (localStorageService, HelperService) {

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
        this.getLanguage = function () {
            return localStorageService.get('language');
        };
        this.setLanguage = function (language) {
            var languageNew = {
                'uid': HelperService.getNewGuid(),
                'changedAt': HelperService.getTime(),
                'key': language
            };
            localStorageService.set('language', languageNew);
        };
        this.getDesign = function () {
            return localStorageService.get('design');
        };
        this.setDesign = function (tmp) {
            var designNew = {
                'uid': HelperService.getNewGuid(),
                'changedAt': HelperService.getTime(),
                'key': tmp
            };
            localStorageService.set('design', designNew);
        };
        this.getBeginNight = function () {
            var time = localStorageService.get('beginNight');
            if (angular.isUndefined(time) || time === null) {
                self.setBeginNight(new Date(1970, 0, 1, 18, 0, 0))
                return self.getBeginNight();
            } else {
                var today = new Date();
                var beginNight = new Date(parseInt(time.time));
                beginNight.setFullYear(today.getFullYear());
                beginNight.setMonth(today.getMonth());
                beginNight.setDate(today.getDate());
                return beginNight;
            }
        };
        this.setBeginNight = function (timeObj) {
            var timeNew = {
                'uid': HelperService.getNewGuid(),
                'changedAt': HelperService.getTime(),
                'time': timeObj.getTime()
            };
            localStorageService.set('beginNight', timeNew);
        };

        return this;
    };

    factory.$inject = ['localStorageService', 'HelperService'];
    return factory;
});