/*global define, console, navigator, cordova, window, FileReader,LocalFileSystem,Uint8Array */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($q, $filter, $timeout, DataService) {
        var self = this;

        this.getBase64FromImageUrl = function (imageUrl) {

            var defer = $q.defer();
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory + imageUrl, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (evt) {
                            defer.resolve({
                                'imageId': imageUrl,
                                'image64': evt.target.result
                            });
                        };
                        reader.readAsDataURL(file);
                    }, fail);
                },
                fail);
            return defer.promise;
        };


        this.writeBase64ImageToFilesSystem = function (imageUrl, image64) {

            var defer = $q.defer();
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
                dir.getFile(imageUrl, {
                    create: true,
                    exclusive: false
                }, function (fileEntry) {
                    fileEntry.createWriter(function (writer) {

                        function _base64ToArrayBuffer(base64) {
                            var binary_string = window.atob(base64);
                            var len = binary_string.length;
                            var bytes = new Uint8Array(len);
                            for (var i = 0; i < len; i++) {
                                bytes[i] = binary_string.charCodeAt(i);
                            }
                            return bytes.buffer;
                        }

                        var replaced = image64.replace('data:image/jpeg;base64,', '');
                        var imageBin = _base64ToArrayBuffer(replaced);

                        writer.onwriteend = function (evt) {

                            defer.resolve(evt);
                        };
                        writer.write(imageBin);
                    }, fail);
                }, fail);
            }, fail);

            return defer.promise;
        };

        this.getPictureAlbumAsFileUrl = function () {
            var defered = $q.defer();


            var options = {
                //quality: 80,
                //targetWidth: 300,
                //targetHeight: 300,
                destinationType: 1, //0=DATA_URL, 1=FILE_URI
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, //0=PHOTOLIBRARY;1=CAMERA
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            self.getPicture(options).then(function (imageURI) {
                defered.resolve(imageURI);
            });

            return defered.promise;
        };

        this.getPictureAlbumAsDataUrl = function (differentOptions) {
            var defered = $q.defer();


            var options = {
                quality: 70,
                targetWidth: 700,
                targetHeight: 700,
                destinationType: 0, //0=DATA_URL, 1=FILE_URI
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, //0=PHOTOLIBRARY;1=CAMERA
                saveToPhotoAlbum: false,
                //correctOrientation: false
            };
            if (angular.isDefined(differentOptions)) {
                options = differentOptions;
            }

            self.getPicture(options).then(function (imageURI) {
                defered.resolve(imageURI);
            });

            return defered.promise;
        };

        this.getPictureCameraAsDataUrl = function (differentOptions) {
            var defered = $q.defer();


            var options = {
                quality: 70,
                targetWidth: 700,
                targetHeight: 700,
                destinationType: 0, //0=DATA_URL, 1=FILE_URI
                sourceType: navigator.camera.PictureSourceType.CAMERA, //0=PHOTOLIBRARY;1=CAMERA
                saveToPhotoAlbum: false,
                //correctOrientation: false
            };

            if (angular.isDefined(differentOptions)) {
                options = differentOptions;
            }

            self.getPicture(options).then(function (imageURI) {
                defered.resolve(imageURI);
            });

            return defered.promise;
        };

        this.getAndStorePictureCamera = function () {
            return self.getAndStorePicture({
                quality: 80,
                //targetWidth: 300,
                //targetHeight: 300,
                sourceType: navigator.camera.PictureSourceType.CAMERA, //0=PHOTOLIBRARY;1=CAMERA
                saveToPhotoAlbum: false,
                correctOrientation: true
            });
        };

        this.getAndStorePictureAlbum = function () {
            return self.getAndStorePicture({
                quality: 80,
                targetWidth: 1024,
                targetHeight: 1024,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, //0=PHOTOLIBRARY;1=CAMERA;2=SAVEDPHOTOALBUM
                saveToPhotoAlbum: false,
                correctOrientation: true
            });
        };

        this.getAndStorePicture = function (options) {
            var usedOptions = {
                quality: 80,
                //targetWidth: 300,
                //targetHeight: 300,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, //0=PHOTOLIBRARY;1=CAMERA
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            if (angular.isDefined(options)) {
                usedOptions = options;
            }


            return self.getPicture(usedOptions).then(function (imageURI) {

                var defered = $q.defer();

                $timeout(createFileEntry, 0, false, imageURI);
                return defered.promise;

                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }

                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + ".jpg";


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

                    defered.resolve(entry.name);
                    //                    $scope.$apply(function () {
                    //                        $scope.images.push(entry.nativeURL);
                    //                    });
                    //$scope.lastPhoto = "" + imageURI;
                }



                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < 10; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }




            }, function (err) {

            });
        };

        function fail(error) {

        }
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
            if (angular.isDefined(imageName) && imageName !== null) {
                var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                var trueOrigin = cordova.file.dataDirectory + name;

                return trueOrigin;
            }
            return undefined;
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
