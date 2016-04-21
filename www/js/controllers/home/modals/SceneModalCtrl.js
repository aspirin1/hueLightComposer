/*global angular, define, console, window, navigator*/

define(function () {
    'use strict';

    function ctrl(HueService, $scope, $timeout, DataService) {
        console.info("SceneModalCtrl init");

        $scope.closeModal = function () {
            console.info($scope.scene);
            $scope.sceneModal.hide();
        };

        $scope.deleteScene = function (sceneId) {
            console.log(sceneId);

            function onConfirm(buttonIndex) {
                if (buttonIndex === 1) //delete
                {
                    HueService.deleteScene(sceneId).then(function (data) {
                        DataService.removeCustomScene(sceneId);
                        $scope.refresh();
                        $scope.closeModal();
                    });
                }
            }

            navigator.notification.confirm(
                'Do you really want to delete the scene "' + $scope.scene.name + '"?', // message
                onConfirm, // callback to invoke with index of button pressed
                'Delete', // title
                    ['Delete', 'Cancel'] // buttonLabels
            );

        };
    }

    ctrl.$inject = ['HueService', '$scope', '$timeout', 'DataService'];
    return ctrl;

});
