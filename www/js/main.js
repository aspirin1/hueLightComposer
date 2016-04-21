/*global define, require, console, cordova, navigator, document */
require.config({
    baseUrl: 'js',
    waitSeconds: 200,
    paths: {
        angular: '../bower_components/angular/angular',
        angularAnimate: '../bower_components/angular-animate/angular-animate',
        angularSanitize: '../bower_components/angular-sanitize/angular-sanitize',
        angularLocalStorage: '../bower_components/angular-local-storage/dist/angular-local-storage',
        uiRouter: '../bower_components/angular-ui-router/release/angular-ui-router',
        ionic: '../bower_components/ionic/release/js/ionic',
        ionicAngular: '../bower_components/ionic/release/js/ionic-angular',
        ionicFilterbar: '../bower_components/ionic-filter-bar/dist/ionic.filter.bar',
        angularTranslate: '../bower_components/angular-translate/angular-translate',
        angularTranslateLoaderStaticFile: '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files',
        noUiSliderAngular: '../res/nouislider-angular-master/nouislider',
        firebase: '../bower_components/firebase/firebase',
        angularfire: '../bower_components/angularfire/dist/angularfire',
        //imgcrop: '../bower_components/ng-img-crop-full-extended/compile/unminified/ng-img-crop'
        imgcrop: '../bower_components/ng-img-crop/compile/unminified/ng-img-crop',
        crop: '../res/cropme-master/cropme',
        jquery: '../bower_components/jquery/dist/jquery',
        hammer: '../bower_components/hammerjs/hammer'
    },
    shim: {
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        angularTranslate: {
            deps: ['angular']
        },
        angularTranslateLoaderStaticFile: {
            deps: ['angularTranslate']
        },
        angularAnimate: {
            deps: ['angularTranslate']
        },
        angularSanitize: {
            deps: ['angularTranslate']
        },
        angularLocalStorage: {
            deps: ['angularTranslate']
        },
        uiRouter: {
            deps: ['angularTranslate']
        },
        ionic: {
            deps: ['angularTranslate', 'angularLocalStorage'],
            exports: 'ionic'
        },
        ionicAngular: {
            deps: ['angularTranslate', 'ionic', 'uiRouter', 'angularAnimate', 'angularSanitize']
        },
        ionicFilterbar: {
            deps: ['ionic', 'angularTranslate']
        },
        noUiSliderAngular: {
            deps: ['angularTranslate']
        },
        angularfire: {
            deps: ['angularTranslate', 'firebase']
        },
        imgcrop: {
            deps: ['angularTranslate']
        },
        crop: {
            deps: ['angularTranslate']
        }
    },
    //    priority: [
    //            'angular',
    //            'angularLocalStorage',
    //            'ionic',
    //            'noUiSlider',
    //            'noUiSliderAngular'
    //        ],
    deps: [
                'bootstrap'
            ]
});
