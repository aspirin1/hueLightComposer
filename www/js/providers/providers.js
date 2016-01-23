/*global define */

define(function (require) {
    'use strict';

    var angular = require('angular'),
        //services = require('services/services'),
        providers = angular.module('app.providers', []);


    providers.provider('config', require('providers/ConfigProvider'));

    return providers;

});
