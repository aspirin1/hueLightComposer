/*global define*/

define(['angular'], function (angular) {
    "use strict";

    var provider = function () {
        return ({
            getGreeting: function () {
                return "hallo";
            },
            //setGreeting: setGreeting,
            $get: function ($rootScope, localStorageService) {
                //console.log($rootScope)
                //return localStorageService.get('userId');
                return ("test");
            }
        });
        /*
            var type;
            return {
                setType: function (value) {
                    type = value;
                },
                $get: ['localStorageService', function (localStorageService) {
                    console.log(localStorageService);
                    // return the factory as a provider
                    // that is available during the configuration phase
                    return null;
                }]
            };
            */
        //return this;
    }

    provider.$inject = [];
    return provider;
});
