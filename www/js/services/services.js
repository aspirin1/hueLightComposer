/*global define */

define(function (require) {

    'use strict';

    var angular = require('angular'),
        config = require('config'),
        services = angular.module('app.services', ['app.config']);

    services.factory('LightCommandService', require('services/LightCommandService'));
    services.factory('EffectService', require('services/EffectService'));
    services.factory('ColorService', require('services/ColorService'));
    services.factory('ColorDataService', require('services/ColorDataService'));
    services.factory('ConfigService', require('services/ConfigService'));
    services.factory('HueService', require('services/HueService'));
    services.factory('DataService', require('services/DataService'));
    services.factory('UtilityService', require('services/UtilityService'));

    return services;

});
