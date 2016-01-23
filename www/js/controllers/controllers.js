/*global define, require */

define(function (require) {

    'use strict';

    var angular = require('angular'),
        services = require('services/services'),
        config = require('config'),
        controllers = angular.module('app.controllers', ['app.services', 'app.config']);

    controllers.controller('NavMenuCtrl', require('controllers/layout/NavMenuCtrl'));
    controllers.controller('SearchBridgeCtrl', require('controllers/searchingBridge/SearchBridgeCtrl'));
    controllers.controller('LightListCtrl', require('controllers/home/LightListCtrl'));
    controllers.controller('LightDetailCtrl', require('controllers/home/LightDetailCtrl'));
    controllers.controller('GroupsCtrl', require('controllers/home/GroupsCtrl'));
    controllers.controller('ScenesCtrl', require('controllers/home/ScenesCtrl'));

    controllers.run(['$rootScope', function ($rootScope) {
        $rootScope.sampleParam = "value";
    }]);

    return controllers;

});
