/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function (ColorDataService, DataService) {
        return {
            restrict: 'E',
            scope: {
                colors: "=",
                options: "=",
                selected: "="
            },
            link: function (scope, element, attrs) {
                scope.options = scope.options || {
                    size: 50,
                    limit: 15
                };

                var getDefaultColors = function () {
                    var ret = ['#000000'];
                    for (var i = 1; i < scope.options.limit; i++) {
                        ret.push(ColorDataService.getRandomHexColorForGamutABC());
                    }
                    return ret;
                };

                var getFavorites = function () {
                    var ret = ['#000000'];
                    var favorites = DataService.getFavorites();
                    for (var i = 0; i <= scope.options.limit && i < favorites.length; i++) {
                        ret.push(favorites[i]);
                    }

                    if (ret.length === 1)
                        return undefined;
                    return ret;
                };

                scope.colors = scope.colors || getFavorites() || getDefaultColors();
                //console.log(scope.colors, getDefaultColors());
                //[
                //                    '#000000',
                //                    '#892be2',
                //            '#a52828',
                //            '#ff7f4f',
                //            '#6393ed',
                //            '#e8967a',
                //            '#473d8c',
                //            '#cc5b5b',
                //            '#ffb878',
                //            '#ff887c',
                //            '#dc2127',
                //            '#dbadff',
                //            '#ef7f7f']


                scope.selected = scope.selected || {
                    color: scope.colors[0]
                };

                scope.selected.color = scope.selected.color || scope.colors[0];



                scope.getContainerStyle = function () {
                    var ret = {
                        'left': '40px',
                        'right': '40px',
                    };


                    return ret;
                };

                scope.getStyle = function (color) {
                    var ret = {
                        'width': scope.options.size + "px",
                        'height': scope.options.size + "px",
                        'background-color': color,
                        'float': 'left'
                    };

                    if (scope.selected.color === color) {
                        ret['box-shadow'] = "inset 0px 0px 0px 4px #f00";
                    }

                    return ret;
                };

                scope.pick = function (color) {
                    scope.selected.color = color;
                };


            },
            templateUrl: 'js/directives/colorScroll/colorScroll.html'
        };
    };

    directive.$inject = ['ColorDataService', 'DataService'];
    return directive;
});
