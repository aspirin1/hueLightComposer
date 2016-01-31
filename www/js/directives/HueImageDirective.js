/*global define*/

define(['angular'], function (angular) {
    "use strict";

    var directive = function () {
        return {
            restrict: 'E',
            scope: {
                light: '=light',
            },
            link: function (scope, element, attrs) {
                attrs.$observe("template", function (v) {
                    scope.contentUrl = 'templates/svgTemplates/' + v + '.html';
                });
            },
            template: '<div ng-include="contentUrl"></div>'
        };
    };

    directive.$inject = [];
    return directive;
});
