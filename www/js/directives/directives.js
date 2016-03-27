/*global define */

define(function (require) {

    'use strict';

    var angular = require('angular'),
        services = require('services/services'),
        directives = angular.module('app.directives', ['app.services']);

    directives.directive('svgImage', require('directives/SvgImageDirective'));
    directives.directive('hueImage', require('directives/HueImageDirective'));
    directives.directive('colorPicker', require('directives/colorPicker/ColorPickerDirective'));
    directives.directive('colorScroll', require('directives/colorScroll/ColorScrollDirective'));
    directives.directive('lightSelection', require('directives/lightSelection/LightSelectionDirective'));
    directives.directive('lightSelectionSortable', require('directives/lightSelectionSortable/LightSelectionSortableDirective'));
    directives.directive('effectButtons', require('directives/effectButtons/effectButtonsDirective'));
    //directives.directive('sortable', require('directives/sortableListDirective'));



    return directives;
});
