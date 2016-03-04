/*global define, console, window, angular*/

define(function () {
    'use strict';

    function ctrl($scope, ConfigService) {

        $scope.theme = function () {
            var design = ConfigService.getDesign();
            // RALF das musste noch richtig machen: Wenn der Key ls.design im Local Storgage aus irgendeinem Grund fehlt,
            // ist Alles für immer doof & man bekommt 12.000 Fehler(ca.), weil design.key natürlich nicht existiert;
            // hab hier nur mal schnell die Abfragen umgedreht und es so hingepfuscht, dass ich daheim Licht machen kann =^.^=
            // Noch einmal die original hue-app für irgendwas zu verwenden hätte ich nicht überlebt. Es war ein absoluter Notfall.
            if (angular.isUndefined(design) || design === null || angular.isUndefined(design.key) || typeof (design) === "string") {
                design = {};
                design.key = "light";
            }
            if (angular.isDefined(design) && angular.isDefined(design.key))
                return design.key;

            return design.key;
        };
    }

    ctrl.$inject = ['$scope', 'ConfigService'];
    return ctrl;

});
