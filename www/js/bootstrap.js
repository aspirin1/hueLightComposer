/*global define, require, console, cordova, navigator, document, window */

define(['angular', 'ionic', 'app', 'routes'], function (angular, ionic, app) {
    'use strict';

    var $html,
        onDeviceReady = function () {
            //https://github.com/katzer/cordova-plugin-background-mode.git
            //0.6.4
            //            cordova.plugins.backgroundMode.enable();
            //            cordova.plugins.backgroundMode.setDefaults({
            //                title: "String",
            //                ticker: "String",
            //                text: "String"
            //            });

            if (angular.isDefined(cordova.plugins) && angular.isDefined(cordova.plugins.backgroundMode)) {

                cordova.plugins.backgroundMode.onactivate = function () {

                };
            }

            angular.bootstrap(document, [app.name]);
        };

    document.addEventListener("deviceready", onDeviceReady, false);

    if (typeof cordova === 'undefined') {
        $html = angular.element(document.getElementsByTagName('html')[0]);
        angular.element().ready(function () {
            try {
                angular.bootstrap(document, [app.name]);
            } catch (e) {

            }
        });
    }

});
