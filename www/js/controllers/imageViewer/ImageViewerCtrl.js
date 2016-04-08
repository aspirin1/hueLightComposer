/*global define, console, window,localStorage,angular,ColorThief,document*/

define(function () {
    'use strict';

    function ctrl($ionicModal, HelperService, $scope, $state, $translate, HueService, ColorService, ColorDataService, User, DataService, localStorageService, UtilityService, $q, Synchronization) {

        $scope.copySelection = {};
        $scope.activeLights = [];
        $scope.hexPalette = ['#fff', '#fff', '#fff', '#fff', '#fff'];

        $scope.loadImage = function () {
            UtilityService.getPictureAlbumAsDataUrl().then(function (data) {
                console.log(data);



                var image = document.getElementById("imageSource");
                image.onload = function () {

                    var image = this;
                    var colorThief = new ColorThief();
                    var palette = colorThief.getPalette(image, 5, 5);
                    var hexPalette = [];
                    angular.forEach(palette, function (rgb) {
                        var hex = ColorService.rgbToHex(rgb[0], rgb[1], rgb[2]);
                        hexPalette.push("#" + hex);
                    });
                    $scope.hexPalette = hexPalette;
                    console.log(palette, hexPalette);

                    for (var i = 0; i < $scope.activeLights.length; i++) {
                        HueService.turnLightOnOff($scope.activeLights[i], true);
                        HueService.changeLightToHexColor($scope.activeLights[i], "C", hexPalette[i]);
                    }
                };
                //$scope.myImage = "file://" + data;
                $scope.myImage = "data:image/jpeg;base64," + data;
            });
        };

        $scope.openModalLightSelection = function () {
            $ionicModal.fromTemplateUrl('copyto-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.copyToModal = modal;
                $scope.copyToModal.show();
            });
        };

        $scope.closeCopyToModal = function () {
            $scope.copyToModal.hide();
        };

        $scope.copyToSelection = function () {
            var selectedLights = [];
            angular.forEach($scope.copySelection, function (value, key) {
                if (value === true) {
                    selectedLights.push(key);
                }
            });
            $scope.activeLights = selectedLights;
            console.log($scope.activeLights);
            $scope.closeCopyToModal();
        };
    }

    ctrl.$inject = ['$ionicModal', 'HelperService', '$scope', '$state', '$translate', 'HueService', 'ColorService', 'ColorDataService', 'User', 'DataService', 'localStorageService', 'UtilityService', '$q', 'Synchronization'];
    return ctrl;

});
