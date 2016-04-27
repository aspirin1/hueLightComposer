/*global define, console, navigator, cordova, window */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (User, localStorageService, UtilityService, $q, DbService) {
        var self = this;
        var favoriteColorsKey = "favoriteColors";
        var customColorsKey = "customColors";
        var customScenesKey = "customScenes";

        var localHistoryKey = "localHistory";
        var lastSynchroKey = "lastSynchro";
        var lastClientChangeKey = "lastClientChange";

        this.isUserLoggedIn = function () {
            return User.getUserAuthData() !== null;
        };

        var getLatestHistoryItem = function (remoteHistory) {
            var latest = {
                'time': -1
            };
            angular.forEach(remoteHistory, function (historyItem) {
                if (historyItem.time > latest.time) latest = historyItem;
            });
            return latest;
        };

        this.start = function () {
            if (!self.isUserLoggedIn()) {
                return;
            }

            User.getUser().$watch(function () {
                var remote_user = User.getUser();
                remote_user.$loaded().then(function () {

                    var lastClientChange = localStorageService.get(lastClientChangeKey);
                    if (lastClientChange === null) {
                        lastClientChange = 0;
                    }

                    var lastSynchronizedHistoryItem = localStorageService.get(lastSynchroKey);
                    if (lastSynchronizedHistoryItem === null) {
                        lastSynchronizedHistoryItem = 0;
                    }

                    if (angular.isUndefined(remote_user.history)) {
                        remote_user.history = [];
                    }


                    var latestRemoteHistory = getLatestHistoryItem(remote_user.history);
                    if (lastClientChange > latestRemoteHistory.time) //client has changes
                    {

                        self.doSync();
                    } else if (latestRemoteHistory.time > lastSynchronizedHistoryItem) //server has changes
                    {

                        self.doSync();
                    }
                });
            });
        };

        function groupBy(array, f) {
            var groups = {};
            array.forEach(function (o) {
                var group = JSON.stringify(f(o));
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            return Object.keys(groups).map(function (group) {
                return groups[group];
            });
        }


        var mergeClientAndRemoteHistory = function (clientHistory, remoteHistory) {
            var mergedList = clientHistory;
            angular.forEach(remoteHistory, function (value) {
                mergedList.push({
                    'type': value.type,
                    'crud': value.crud,
                    'uid': value.uid,
                    'time': value.time
                });
            });


            var groupedByTypeAndIdList = groupBy(mergedList, function (item) {
                return [item.type, item.uid];
            });


            var mergedHistoryList = [];
            angular.forEach(groupedByTypeAndIdList, function (group) {
                if (group.length === 1) {
                    mergedHistoryList.push(group[0]);
                } else {
                    var latest = {
                        'time': -1
                    };
                    angular.forEach(group, function (groupedItem) {
                        if (groupedItem.time > latest.time) latest = groupedItem;
                    });
                    mergedHistoryList.push(latest);
                }
            });

            return mergedHistoryList;
        };

        this.doSync = function () {

            if (!self.isUserLoggedIn()) {
                return;
            }

            var lastClientChange = localStorageService.get(lastClientChangeKey);
            if (lastClientChange === null) {
                lastClientChange = 0;
            }

            var lastSynchronizedHistoryItem = localStorageService.get(lastSynchroKey);
            if (lastSynchronizedHistoryItem === null) {
                lastSynchronizedHistoryItem = 0;
            }

            var clientHistory = localStorageService.get(localHistoryKey);
            if (clientHistory === null) {
                clientHistory = [];
            }

            var clientScenes = localStorageService.get(customScenesKey);
            if (clientScenes === null) {
                clientScenes = {};
            }

            var clientFavorites = localStorageService.get(favoriteColorsKey);
            if (clientFavorites === null) {
                clientFavorites = {};
            }

            var clientColors = localStorageService.get(customColorsKey);
            if (clientColors === null) {
                clientColors = {};
            }

            var remote_user = User.getUser();
            remote_user.$loaded().then(function () {


                if (angular.isUndefined(remote_user.lastSynchroTime)) {
                    remote_user.lastSynchroTime = 0;
                }

                if (angular.isUndefined(remote_user.history)) {
                    remote_user.history = [];
                }

                if (angular.isUndefined(remote_user.favorites)) {
                    remote_user.favorites = {};
                }

                if (angular.isUndefined(remote_user.colors)) {
                    remote_user.colors = {};
                }

                if (angular.isUndefined(remote_user.scenes)) {
                    remote_user.scenes = {};
                }

                if (angular.isUndefined(remote_user.images)) {
                    remote_user.images = {};
                }

                var imagePromises = [];
                var images = {};
                var mergedHistory = mergeClientAndRemoteHistory(clientHistory, remote_user.history);

                angular.forEach(mergedHistory, function (historyItem) {
                    if (historyItem.type === 'favorite') {
                        if (historyItem.crud === 'create') {
                            //favorite not yet on remote server
                            if (!(historyItem.uid in remote_user.favorites)) {
                                var clientFavorite = clientFavorites[historyItem.uid];
                                remote_user.favorites[historyItem.uid] = clientFavorite;
                            }
                        } else if (historyItem.crud === 'delete') {
                            delete remote_user.favorites[historyItem.uid];
                        }
                    } else if (historyItem.type === 'color') {
                        if (historyItem.crud === 'create') {
                            //color not yet on remote server
                            if (!(historyItem.uid in remote_user.colors)) {
                                var clientColor = clientColors[historyItem.uid];
                                remote_user.colors[historyItem.uid] = clientColor;
                            }
                        } else if (historyItem.crud === 'delete') {
                            delete remote_user.colors[historyItem.uid];
                        }

                    } else if (historyItem.type === 'scene') {
                        if (historyItem.crud === 'create') {
                            //scene not yet on remote server
                            if (!(historyItem.uid in remote_user.scenes)) {
                                var clientScene = clientScenes[historyItem.uid];
                                remote_user.scenes[historyItem.uid] = clientScene;

                                if (angular.isDefined(clientScene.image) && clientScene.image !== null && !(clientScene.image in remote_user.images)) {
                                    var imagePromise = DbService.getImageByImageId(clientScene.image).then(function (data) {
                                        images[data.imageId] = {
                                            'imageId': data.imageId,
                                            'image64': data.imageData
                                        };
                                    });
                                    imagePromises.push(imagePromise);
                                }
                            }
                        } else if (historyItem.crud === 'delete') {
                            var remoteScene = remote_user.scenes[historyItem.uid];
                            if (angular.isDefined(remoteScene) && angular.isDefined(remoteScene.image) && remoteScene.image !== null) {
                                var imageKey = remoteScene.image.replace('.jpg', '');
                                delete remote_user.images[imageKey];
                            }
                            delete remote_user.scenes[historyItem.uid];
                        } else if (historyItem.crud === 'update') {

                        }
                    }
                });

                remote_user.history = mergedHistory;
                localStorageService.set(localHistoryKey, null);
                localStorageService.set(lastClientChangeKey, null);

                var synchroTime = getLatestHistoryItem(remote_user.history);
                remote_user.lastSynchroTime = synchroTime.time;
                localStorageService.set(lastSynchroKey, synchroTime.time);


                localStorageService.set(customScenesKey, remote_user.scenes);
                localStorageService.set(customColorsKey, remote_user.colors);
                localStorageService.set(favoriteColorsKey, remote_user.favorites);

                angular.forEach(remote_user.scenes, function (scene) {
                    if (scene.image !== null) {
                        var imageKey = scene.image;
                        if (angular.isDefined(remote_user.images) && (imageKey in remote_user.images)) {
                            //UtilityService.writeBase64ImageToFilesSystem(scene.image, remote_user.images[imageKey].image64);
                            DbService.insertOrUpdateImage(scene.image, remote_user.images[imageKey].image64);
                        }
                    }
                });

                $q.all(imagePromises).then(function () {
                    if (angular.isUndefined(remote_user.images)) {
                        remote_user.images = {};
                    }

                    angular.forEach(images, function (value, key) {
                        remote_user.images[key] = value;
                    });

                    remote_user.$save();
                });

                //remote_user.$save();

            });
        };

        return this;
    };

    factory.$inject = ['User', 'localStorageService', 'UtilityService', '$q', 'DbService'];
    return factory;
});
