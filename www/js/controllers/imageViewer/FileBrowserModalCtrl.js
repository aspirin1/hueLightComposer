/*global define, console, window,localStorage,angular,ColorThief,document*/

define(function () {
    'use strict';

    function ctrl($ionicPopover, $ionicModal, $scope, HueService, ColorService, DataService, UtilityService, $q) {

        $scope.$on('modal.shown', function (event, modal) {
            if (modal.id === "fileBrowserModal") {
                getEntriesAtRoot().then(function (result) {
                    $scope.files = result;
                }, function (error) {
                    console.error(error);
                });

                $scope.getContents = function (path) {
                    getEntries(path).then(function (result) {
                        $scope.files = result;
                        $scope.files.unshift({
                            name: "[parent]"
                        });
                        getParentDirectory(path).then(function (result) {
                            result.name = "[parent]";
                            $scope.files[0] = result;
                        });
                    });
                }
            }
        });

        var getParentDirectory = function (path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURL(path, function (fileSystem) {
                fileSystem.getParent(function (result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        var getEntriesAtRoot = function () {
            var deferred = $q.defer();
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                var directoryReader = fileSystem.root.createReader();
                directoryReader.readEntries(function (entries) {
                    deferred.resolve(entries);
                }, function (error) {
                    deferred.reject(error);
                });
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        var getEntries = function (path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURL(path, function (fileSystem) {
                var directoryReader = fileSystem.createReader();
                directoryReader.readEntries(function (entries) {
                    deferred.resolve(entries);
                }, function (error) {
                    deferred.reject(error);
                });
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        $scope.closeModal = function () {
            $scope.fileBrowserModal.remove();
        };

    }

    ctrl.$inject = ['$ionicPopover', '$ionicModal', '$scope', 'HueService', 'ColorService', 'DataService', 'UtilityService', '$q'];
    return ctrl;

});