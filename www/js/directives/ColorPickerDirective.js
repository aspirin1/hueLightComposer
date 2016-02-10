/*global define*/

define(['angular'], function (angular) {
    "use strict";
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    var directive = function () {
        return {
            restrict: 'E',
            scope: {
                colors: "=",
                options: "=",
                selected: "="
            },
            link: function (scope, element, attrs) {
                scope.colors = scope.colors || [
                    '#000000',
                    '#892be2',
            '#a52828',
            '#ff7f4f',
            '#6393ed',
            '#e8967a',
            '#473d8c',
            '#cc5b5b',
            '#ffb878',
            '#ff887c',
            '#dc2127',
            '#dbadff',
            '#ef7f7f'];

                scope.selected = scope.selected || {
                    color: scope.colors[0]
                };

                scope.selected.color = scope.selected.color || scope.colors[0];

                //scope.selected.color = scope.selected.color || scope.colors[0];
                scope.options = scope.options || {
                    size: 30,
                    columns: 5
                };

                scope.getStyle = function (color) {
                    var ret = {
                        'height': scope.options.size + "px",
                        'background-color': color,
                    };

                    if (scope.selected.color === color) {
                        ret['box-shadow'] = "inset 0px 0px 0px 4px #f00";
                    }

                    return ret;
                };

                scope.pick = function (color) {
                    scope.selected.color = color;
                    console.log(scope.selected);
                };

                scope.rows = [];
                scope.cols = [];

                scope.$watch("scope.colors.length", function () {
                    for (var i = 0; i < Math.ceil(scope.colors.length / scope.options.columns); i++) {
                        scope.rows.push(i);
                    }
                    for (var j = 0; j < scope.options.columns; j++) {
                        scope.cols.push(j);
                    }
                });

            },
            templateUrl: 'js/directives/colorPicker.html'
        };
    };

    directive.$inject = [];
    return directive;
});
