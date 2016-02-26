/*global define, console, navigator, cordova, window */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($q, $filter, $timeout, DataService) {
        var self = this;



        this.getAndStorePictureCamera = function () {
            return self.getAndStorePicture({
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                sourceType: navigator.camera.PictureSourceType.CAMERA, //0=PHOTOLIBRARY;1=CAMERA
                saveToPhotoAlbum: false
            });
        };

        this.getAndStorePictureAlbum = function () {
            return self.getAndStorePicture({
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, //0=PHOTOLIBRARY;1=CAMERA;2=SAVEDPHOTOALBUM
                saveToPhotoAlbum: false
            });
        };

        this.getAndStorePicture = function (options) {
            var usedOptions = {
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, //0=PHOTOLIBRARY;1=CAMERA
                saveToPhotoAlbum: false
            };

            if (angular.isDefined(options)) {
                usedOptions = options;
            }
            console.log(usedOptions);

            return self.getPicture(usedOptions).then(function (imageURI) {
                console.log(imageURI);
                var defered = $q.defer();

                $timeout(createFileEntry, 0, false, imageURI);
                return defered.promise;

                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }

                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;

                    console.log(newName, cordova.file.dataDirectory);
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                            fileEntry.copyTo(
                                fileSystem2,
                                newName,
                                onCopySuccess,
                                fail
                            );
                        },
                        fail);
                }

                function onCopySuccess(entry) {
                    console.log(entry);
                    defered.resolve(entry.name);
                    //                    $scope.$apply(function () {
                    //                        $scope.images.push(entry.nativeURL);
                    //                    });
                    //$scope.lastPhoto = "" + imageURI;
                }

                function fail(error) {
                    console.error("fail: " + error.code);
                }

                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }




            }, function (err) {
                console.err(err);
            });
        };

        this.getPicture = function (options) {
            var q = $q.defer();

            navigator.camera.getPicture(function (result) {
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        };

        this.getUrlForImage = function (imageName) {
            if (angular.isDefined(imageName)) {
                var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                var trueOrigin = cordova.file.dataDirectory + name;
                return trueOrigin;
            }
        };

        this.getLightById = function (allLights, id) {
            for (var i = 0; i < allLights.length; i++) {
                if (allLights[i].id === id) {
                    return allLights[i];
                }
            }
        };

        this.round = function (value, decimals) {
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        };

        this.getRandomXy = function (minX, maxX, minY, maxY) {
            var x = self.getRandomArbitrary(minX, maxX),
                y = self.getRandomArbitrary(minY, maxY);
            return [x, y];
        };

        /**
         * Returns a random number between min (inclusive) and max (exclusive)
         */
        this.getRandomArbitrary = function (min, max) {
            return self.round(Math.random() * (max - min) + min, 5);
        };

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give you a non-uniform distribution!
         */
        this.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        this.msToTransitionTime = function (time) {
            return parseInt(time / 100);
        };

        this.delayed = function (lightId, func, delay, arg0, arg1, arg2, arg3, arg4, arg5) {
            if (!DataService.isStopped(lightId))
                DataService.pushTimeout(lightId, $timeout(func, delay, false, arg0, arg1, arg2, arg3, arg4, arg5));
        };

        this.resetTimeoutForId = function (lightId) {
            DataService.resetTimeouts(lightId);
        };

        this.calculateFormattedPercentage = function (max, current) {
            var percentage = current / max;
            var formattedPercentage = Math.round(percentage * 100);
            return formattedPercentage + " %";
        };


        this.getEffectRunningText = function (allLights, lightId) {
            if (allLights.length > 0) {
                var eff = DataService.getEffect(lightId);
                if (angular.isUndefined(eff)) {
                    return $filter('translate')('NO_EFFECT_RUNNING');
                } else {
                    return $filter('translate')('Effect_' + eff.effect);
                }
            }
            return "";
        };

        return this;
    };

    factory.$inject = ['$q', "$filter", "$timeout", "DataService"];
    return factory;
});
