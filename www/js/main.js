/*global define, require, console, cordova, navigator, document */
require.config({
    baseUrl: 'js',
    paths: {
        angular: '../bower_components/angular/angular.min',
        angularAnimate: '../bower_components/angular-animate/angular-animate.min',
        angularSanitize: '../bower_components/angular-sanitize/angular-sanitize.min',
        angularLocalStorage: '../bower_components/angular-local-storage/dist/angular-local-storage.min',
        uiRouter: '../bower_components/angular-ui-router/release/angular-ui-router.min',
        ionic: '../bower_components/ionic/release/js/ionic.min',
        ionicAngular: '../bower_components/ionic/release/js/ionic-angular.min',
        angularTranslate: '../bower_components/angular-translate/angular-translate.min',
        angularTranslateLoaderStaticFile: '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        angularAnimate: {
            deps: ['angular']
        },
        angularSanitize: {
            deps: ['angular']
        },
        angularLocalStorage: {
            deps: ['angular']
        },
        uiRouter: {
            deps: ['angular']
        },
        angularTranslate: {
            deps: ['angular']
        },
        angularTranslateLoaderStaticFile: {
            deps: ['angularTranslate']
        },
        ionic: {
            deps: ['angular', 'angularLocalStorage'],
            exports: 'ionic'
        },
        ionicAngular: {
            deps: ['angular', 'ionic', 'uiRouter', 'angularAnimate', 'angularSanitize']
        }
    },
    priority: [
        'angular',
        'angularLocalStorage',
        'ionic',
    ],
    deps: [
        'bootstrap'
    ]
});
