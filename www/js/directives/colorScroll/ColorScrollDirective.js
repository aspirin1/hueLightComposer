/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function (ColorDataService, DataService, $rootScope, $ionicActionSheet) {
        return {
            restrict: 'E',
            scope: {
                colors: "=",
                options: "=",
                selected: "=",
                changed: "&"
            },
            link: function (scope, element, attrs) {
                scope.options = scope.options || {
                    size: 50,
                    limit: 15
                };

                var getDefaultColors = function () {
                    var ret = [
                        //'#000000'
                    ];
                    for (var i = 0; i < scope.options.limit; i++) {
                        ret.push(ColorDataService.getRandomHexColorForGamutABC());
                    }
                    return ret;
                };

                var getFavorites = function () {
                    var ret = [
                        //'#000000'
                    ];
                    var favorites = DataService.getFavorites();
                    for (var i = 0; i < scope.options.limit && i < favorites.length; i++) {
                        ret.push(favorites[i]);
                    }

                    if (ret.length === 0)
                        return undefined;
                    return ret;
                };

                scope.colors = scope.colors || getFavorites() || getDefaultColors();

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
                    $rootScope.$broadcast('ColorChanged', color);
                };


                scope.openPopover = function () {
                    scope.hideSheet = $ionicActionSheet.show({
                        buttons: [
                            {
                                text: 'Favorites'
                        },
                            {
                                text: 'Random'
                        }
     ],
                        titleText: 'Change your colors',
                        cancelText: 'Cancel',
                        cancel: function () {
                            scope.hideSheet();
                        },
                        buttonClicked: function (index) {
                            if (index === 0)
                                scope.loadFavorites();
                            if (index === 1)
                                scope.loadRandom();
                            return true;
                        }
                    });
                };

                scope.loadFavorites = function () {
                    scope.colors = getFavorites() || [];
                    if (scope.colors.length > 0)
                        scope.selected.color = scope.colors[0];
                    scope.hideSheet();
                };

                scope.loadRandom = function () {
                    scope.colors = getDefaultColors();
                    if (scope.colors.length > 0)
                        scope.selected.color = scope.colors[0];
                    scope.hideSheet();
                };
            },
            templateUrl: 'js/directives/colorScroll/colorScroll.html'
        };
    };

    directive.$inject = ['ColorDataService', 'DataService', '$rootScope', '$ionicActionSheet'];
    return directive;
});
