/*global define */

define(function (require) {

    'use strict';

    var angular = require('angular'),
        config = require('config'),
        services = angular.module('app.services', ['app.config']);

    services.factory('Auth', require('services/Service/Auth'));
    services.factory('User', require('services/Service/User'));
    services.factory('Synchronization', require('services/Service/Synchronization'));

    services.factory('LightCommandService', require('services/LightCommandService'));
    services.factory('EffectService', require('services/EffectService'));
    services.factory('ColorService', require('services/ColorService'));
    services.factory('ColorDataService', require('services/ColorDataService'));
    services.factory('ConfigService', require('services/ConfigService'));
    services.factory('HueService', require('services/HueService'));
    services.factory('DataService', require('services/DataService'));
    services.factory('UtilityService', require('services/UtilityService'));
    services.factory('HelperService', require('services/HelperService'));
    services.factory('DbService', require('services/DbService'));


    return services;

});
