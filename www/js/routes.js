/*global define, require, console */

define(['app'], function (app) {
    'use strict';


    app.config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider',

        function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
            //$ionicConfigProvider.views.forwardCache(false);
            //$ionicConfigProvider.views.maxCache(0);
            $ionicConfigProvider.tabs.position("bottom");


            //single pages - no common layout
            $stateProvider.state('searchingBridge', {
                url: "/searchingBridge",
                templateUrl: "templates/searchingBridge/searchingBridge.html",
                controller: 'SearchBridgeCtrl'
            });

            //common main layout
            //abstract layouts
            $stateProvider.state('main', {
                    url: "/main",
                    abstract: true,
                    templateUrl: "templates/layouts/main.html",
                    resolve: {
                        authenticate: authenticate
                    }
                })
                .state('main.home_tab', {
                    url: "/home_tab",
                    abstract: true,
                    templateUrl: "templates/layouts/home_tab.html",
                });

            //using main + home_tab layout pages
            $stateProvider.state('main.home_tab.lightList', {
                    url: '/lightList',
                    views: {
                        'lightList-tab': {
                            templateUrl: 'templates/home/lightList.html',
                            controller: 'LightListCtrl'
                        }
                    }
                })
                .state('main.home_tab.lightDetail', {
                    url: '/lightDetail/:id',
                    views: {
                        'lightList-tab': {
                            templateUrl: 'templates/home/lightDetail.html',
                            controller: function ($scope, $stateParams) {
                                $scope.lightId = $stateParams.id;
                            }
                        }
                    }
                })
                .state('main.home_tab.groups', {
                    url: '/groups',
                    views: {
                        'groups-tab': {
                            templateUrl: 'templates/home/groups.html',
                            controller: 'GroupsCtrl'
                        }
                    }
                })
                .state('main.home_tab.scenes', {
                    url: '/scenes',
                    views: {
                        'scenes-tab': {
                            templateUrl: 'templates/home/scenes.html',
                            controller: 'ScenesCtrl'
                        }
                    }
                });

            //using main layout pages
            $stateProvider.state('main.settings', {
                url: '/settings',
                templateUrl: 'templates/settings/settings.html',
            });

            $urlRouterProvider.otherwise("main/home_tab/lightList");

            function authenticate($q, $state, $timeout, ConfigService) {
                console.log('authenticate');
                if (ConfigService.getBridgeUrl() !== null && ConfigService.getUserId() !== null) {
                    // Resolve the promise successfully
                    //return $q.when();
                    return $q.resolve();
                } else {
                    // The next bit of code is asynchronously tricky.

                    $timeout(function () {
                        // This code runs after the authentication promise has been rejected.
                        // Go to the log-in page
                        $state.go('searchingBridge');
                    }, 100);

                    // Reject the authentication promise to prevent the state from loading
                    return $q.reject();
                }
            }
    }]);
});
