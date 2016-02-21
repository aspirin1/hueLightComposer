/*global define, require, console,window */

define(['app'], function (app) {
    'use strict';

    app.config(['$translateProvider', function ($translateProvider) {

        $translateProvider.useStaticFilesLoader({
                prefix: 'languages/',
                suffix: '.json'
            })
            .registerAvailableLanguageKeys(['en', 'de'], {
                'en*': 'en',
                'de*': 'de',
            })
            .determinePreferredLanguage()
            .fallbackLanguage('en');

        var lang = window.localStorage['ls.language'];
        if (typeof (lang) !== 'undefined') {
            $translateProvider.preferredLanguage(JSON.parse(lang));
        }
        //$translateProvider.useSanitizeValueStrategy('sanitize');

                    }]);

    app.config(['$ionicConfigProvider', function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
        $ionicConfigProvider.platform.android.navBar.alignTitle('middle');
        $ionicConfigProvider.views.forwardCache(false);
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.tabs.position("bottom");
        $ionicConfigProvider.tabs.style("striped");
    }]);

    app.config(['$stateProvider', '$urlRouterProvider',

        function ($stateProvider, $urlRouterProvider) {

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
                })
                .state('main.home_tab.colors', {
                    url: '/colors',
                    views: {
                        'colors-tab': {
                            templateUrl: 'templates/home/colors.html',
                            controller: 'ColorsCtrl'
                        }
                    }
                });


            $stateProvider.state('main.home_tab.effectList', {
                url: '/effectList',
                views: {
                    'effectList-tab': {
                        templateUrl: 'templates/effects/effectList.html',
                        controller: 'EffectListCtrl'
                    }
                }
            });
            $stateProvider.state('main.home_tab.colorLoop', {
                url: '/colorLoop',
                views: {
                    'effectList-tab': {
                        templateUrl: 'templates/effects/colorLoop.html',
                        controller: 'ColorLoopCtrl'
                    }
                }
            });
            $stateProvider.state('main.home_tab.lightning', {
                url: '/lightning',
                views: {
                    'effectList-tab': {
                        templateUrl: 'templates/effects/lightning.html',
                        controller: 'LightningCtrl'
                    }
                }
            });
            $stateProvider.state('main.home_tab.pulse', {
                url: '/pulse',
                views: {
                    'effectList-tab': {
                        templateUrl: 'templates/effects/pulse.html',
                        controller: 'PulseCtrl'
                    }
                }
            });
            $stateProvider.state('main.home_tab.pulseMultiColors', {
                url: '/pulseMultiColors',
                views: {
                    'effectList-tab': {
                        templateUrl: 'templates/effects/pulseMultiColors.html',
                        controller: 'PulseMultiColorsCtrl'
                    }
                }
            });
            $stateProvider.state('main.home_tab.pulseChangingColors', {
                url: '/pulseChangingColors',
                views: {
                    'effectList-tab': {
                        templateUrl: 'templates/effects/pulseChangingColors.html',
                        controller: 'PulseChangingColorsCtrl'
                    }
                }
            });
            $stateProvider.state('main.home_tab.standard', {
                url: '/standard/:effect',
                views: {
                    'effectList-tab': {
                        templateUrl: 'templates/effects/standard.html',
                        controller: function ($scope, $stateParams) {
                            $scope.effect = $stateParams.effect;
                        }
                    }
                }
            });


            //using main layout pages
            $stateProvider.state('main.settings', {
                url: '/settings',
                templateUrl: 'templates/settings/settings.html',
                controller: 'SettingsCtrl'
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
