/*global define, require */

define(function (require) {

    'use strict';

    var angular = require('angular'),
        services = require('services/services'),
        config = require('config'),
        controllers = angular.module('app.controllers', ['app.services', 'app.config']);

    controllers.controller('AppCtrl', require('controllers/AppCtrl'));
    controllers.controller('BodyCtrl', require('controllers/layout/BodyCtrl'));
    controllers.controller('NavMenuCtrl', require('controllers/layout/NavMenuCtrl'));

    controllers.controller('SearchBridgeCtrl', require('controllers/searchingBridge/SearchBridgeCtrl'));
    controllers.controller('LightListCtrl', require('controllers/home/LightListCtrl'));
    controllers.controller('LightDetailCtrl', require('controllers/home/LightDetailCtrl'));
    controllers.controller('GroupsCtrl', require('controllers/home/GroupsCtrl'));
    controllers.controller('GroupCommandCtrl', require('controllers/home/GroupCommandCtrl'));

    controllers.controller('ScenesCtrl', require('controllers/home/ScenesCtrl'));
    controllers.controller('SceneModalCtrl', require('controllers/home/modals/SceneModalCtrl'));
    controllers.controller('NewSceneCtrl', require('controllers/home/NewSceneCtrl'));
    controllers.controller('NewSceneImageCtrl', require('controllers/home/NewSceneImageCtrl'));
    controllers.controller('ColorsCtrl', require('controllers/home/ColorsCtrl'));
    controllers.controller('ColorsAdministrationCtrl', require('controllers/home/ColorsAdministrationCtrl'));

    controllers.controller('SettingsCtrl', require('controllers/settings/SettingsCtrl'));
    controllers.controller('ImageViewerCtrl', require('controllers/imageViewer/ImageViewerCtrl'));

    controllers.controller('EffectListCtrl', require('controllers/effects/EffectListCtrl'));
    controllers.controller('StandardEffectCtrl', require('controllers/effects/StandardEffectCtrl'));
    controllers.controller('ColorLoopCtrl', require('controllers/effects/ColorLoopCtrl'));
    controllers.controller('LightningCtrl', require('controllers/effects/LightningCtrl'));
    controllers.controller('PulseCtrl', require('controllers/effects/PulseCtrl'));
    controllers.controller('PulseChangingColorsCtrl', require('controllers/effects/PulseChangingColorsCtrl'));
    controllers.controller('PulseMultiColorsCtrl', require('controllers/effects/PulseMultiColorsCtrl'));
    controllers.controller('StrobeCtrl', require('controllers/effects/StrobeCtrl'));
    controllers.controller('BeaconCtrl', require('controllers/effects/BeaconCtrl'));



    controllers.run(['$rootScope', function ($rootScope) {
        //$rootScope.sampleParam = "value";
    }]);


    return controllers;

});
