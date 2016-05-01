/*global define, document, console*/

define(['angular'], function (angular) {
    "use strict";
    var directive = function ($ionicModal) {

        return {
            restrict: 'E',
            scope: {

            },
            link: function (scope, element, attrs) {
                $ionicModal.fromTemplateUrl('js/directives/newColorPicker/modal.html', {
                    scope: scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    scope.modal = modal;
                });

                scope.blockStyle = {
                    'height': '40px',
                    'width': '40px',
                    'display': 'block',
                    'background-color': '#000'
                };

                scope.innerState = {
                    temporaryHexColor: '#efefef',
                    selectedPicker: 'hueSat'
                };

                scope.openModal = function () {
                    scope.modal.show();
                };

                scope.closeModal = function () {
                    scope.modal.hide();
                };

                scope.commitColor = function () {
                    scope.blockStyle['background-color'] = scope.innerState.temporaryHexColor;
                    scope.closeModal();
                };
            },
            templateUrl: 'js/directives/newColorPicker/newColorPicker.html'
        };
    };

    directive.$inject = ['$ionicModal'];
    return directive;
});