/*global define */

define(['angular'], function (angular) {
    'use strict';

    return angular.module('app.config', [])
        .constant('VERSION', '0.1')
        .constant('FirebaseUrl', 'https://resplendent-torch-1627.firebaseio.com/');

});
