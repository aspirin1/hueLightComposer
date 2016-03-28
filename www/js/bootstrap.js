/*global define, require, console, cordova, navigator, document */

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
                console.log("device ready background mode", cordova.plugins.backgroundMode);
                cordova.plugins.backgroundMode.onactivate = function () {
                    console.info("activate background mode");
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
                console.error(e.stack || e.message || e);
            }
        });
    }

});
