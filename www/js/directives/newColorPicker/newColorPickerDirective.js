/*global define, document, console,ColorThief*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function ($ionicModal, $ionicLoading, ColorService, DataService, ColorsJson, UtilityService) {

        return {
            restrict: 'E',
            scope: {
                color: "="
            },
            link: function (scope, element, attrs) {
                console.log(scope.color);
                scope.color = scope.color || '#ffffff';

                function initColors() {
                    loadFavoriteColors();
                    loadOwnColors();
                    registerSliderEvents();
                }

                function loadPredefinedColors() {
                    scope.innerState.predefinedColorsView.colors = JSON.parse(ColorsJson);
                }

                function loadFavoriteColors() {
                    scope.innerState.favoritesView.colors = DataService.getFavorites();
                }

                function loadOwnColors() {
                    DataService.getOwnColors().then(function (data) {
                        scope.innerState.ownColorsView.colors = data;
                    });
                }

                function registerSliderEvents() {
                    scope.saturationSliderEvents = {
                        change: function (values, handle, unencoded) {
                            var sat = parseInt(values[0][0]);
                            scope.innerState.hueSatView.sat = sat;
                            hueSatChanged();
                        }
                    };

                    scope.hueSliderEvents = {
                        change: function (values, handle, unencoded) {
                            var hue = parseInt(values[0][0]);
                            scope.innerState.hueSatView.hue = hue;
                            hueSatChanged();
                        }
                    };

                    scope.saturationOptions = {
                        start: [scope.innerState.hueSatView.sat],
                        connect: 'lower',
                        step: 1,
                        range: {
                            'min': 1,
                            'max': 254
                        }
                    };

                    scope.hueOptions = {
                        start: [scope.innerState.hueSatView.hue],
                        connect: 'lower',
                        step: 500,
                        range: {
                            'min': 0,
                            'max': 65535
                        }
                    };
                }

                function unregisterSliderEvents() {
                    scope.saturationSliderEvents = {};
                    scope.hueSliderEvents = {};
                    scope.saturationOptions = {};
                    scope.hueOptions = {};
                }

                function hueSatChanged() {
                    var hue = scope.innerState.hueSatView.hue;
                    var sat = scope.innerState.hueSatView.sat;
                    var hexColor = ColorService.hueSatToHex(hue, sat);
                    scope.colorSelectionChanged(hexColor);
                }

                function resetInnerState() {
                    scope.innerState = {
                        temporaryHexColor: scope.color,
                        selectedPicker: 'hueSat',
                        hueSatView: {
                            hue: 32500,
                            sat: 175
                        },
                        favoritesView: {
                            colors: []
                        },
                        ownColorsView: {
                            colors: []
                        },
                        predefinedColorsView: {
                            colors: []
                        }
                    };
                    scope.selectedColorStyle['background-color'] = scope.color;
                }

                scope.innerState = {
                    temporaryHexColor: scope.color,
                    selectedPicker: 'hueSat',
                    hueSatView: {
                        hue: 32500,
                        sat: 175
                    },
                    favoritesView: {
                        colors: []
                    },
                    ownColorsView: {
                        colors: []
                    },
                    predefinedColorsView: {
                        colors: []
                    }
                };

                scope.blockStyle = {
                    'height': '50px',
                    'width': '50px',
                    'display': 'block',
                    'border': '3px dashed',
                    'border-color': '#ddd',
                    'background-color': scope.color
                };

                scope.selectedColorStyle = {
                    'height': '40px',
                    'background-color': scope.innerState.temporaryHexColor
                };



                scope.colorSelectionChanged = function (hexColor) {
                    scope.innerState.temporaryHexColor = hexColor;
                    scope.selectedColorStyle['background-color'] = hexColor;
                };



                scope.openModal = function () {
                    initColors();
                    $ionicModal.fromTemplateUrl('js/directives/newColorPicker/modal.html', {
                        scope: scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });
                };

                scope.closeModal = function () {
                    resetInnerState();
                    scope.modal.remove();
                };

                scope.commitColor = function () {
                    scope.blockStyle['background-color'] = scope.innerState.temporaryHexColor;
                    scope.color = scope.innerState.temporaryHexColor;
                    scope.closeModal();
                };

                scope.getSingleColorBlockStyle = function (hexColor) {
                    return {
                        'background-color': hexColor.toString()
                    };
                };

                scope.selectedPickerChanged = function () {
                    if (scope.innerState.selectedPicker === "predefinedColors" && scope.innerState.predefinedColorsView.colors.length === 0) {
                        $ionicLoading.show();
                        loadPredefinedColors();
                        $ionicLoading.hide();
                    }
                };

                function loadPhotoPickerImage(data) {
                    $ionicLoading.show();
                    var image = document.getElementById("photoPickerImage");
                    image.onload = function () {
                        var colorThief = new ColorThief();
                        var palette = colorThief.getPalette(image, 20, 4);
                        console.info(palette.length);
                        var swatches = [];
                        angular.forEach(palette, function (rgb) {
                            var hex = ColorService.rgbToHex(rgb[0], rgb[1], rgb[2]);
                            var hsl = ColorService.hexToHsl(hex);
                            swatches.push({
                                hexColor: hex,
                                hsl: hsl
                            });
                        });
                        scope.swatches = swatches;
                        $ionicLoading.hide();
                    };
                    scope.photoPickerImageSource = "data:image/jpeg;base64," + data;
                }

                scope.getSwatchStyle = function (swatch) {
                    return {
                        'height': '50px',
                        'width': '50px',
                        'display': 'block',
                        'border': '3px dashed',
                        'border-color': '#ddd',
                        'background-color': swatch.hexColor
                    };
                };

                scope.photoPickerAlbum = function () {
                    UtilityService.getPictureAlbumAsDataUrl().then(function (data) {
                        loadPhotoPickerImage(data);
                    });
                };

                scope.photoPickerCamera = function () {
                    UtilityService.getPictureCameraAsDataUrl().then(function (data) {
                        loadPhotoPickerImage(data);
                    });
                };

            },
            templateUrl: 'js/directives/newColorPicker/newColorPicker.html'
        };
    };

    directive.$inject = ['$ionicModal', '$ionicLoading', 'ColorService', 'DataService', 'ColorsJson', 'UtilityService'];
    return directive;
});