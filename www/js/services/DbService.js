/*global define, console, window */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($q, PlaceholderDataUrl) {
        var self = this;
        var db = null;

        var isSqliteDefined = function () {
            return angular.isDefined(window.sqlitePlugin);
        };

        var errorCb = function (err) {
            console.error('Database ERROR: ' + JSON.stringify(err));
        };
        var errorCbWithCloseDb = function (err) {
            console.error('Database ERROR: ' + JSON.stringify(err));
            closeDbConnection(getDbConnection());
        };
        var successCb = function () {
            //console.log('Database Success:' + JSON.stringify(err));
            console.log('transaction ok');
            //closeDbConnection(getDbConnection());
        };

        var getDbConnection = function () {
            if (db === null && isSqliteDefined()) {
                db = window.sqlitePlugin.openDatabase({
                    name: 'my.db',
                    location: 'default'
                }, function () {
                    console.log("OPEN successful");
                }, errorCb);
            }
            return db;
        };

        var closeDbConnection = function (db) {
            db.close();
        };

        var createTables = function () {
            if (!isSqliteDefined()) {
                return;
            }

            getDbConnection().transaction(function (tx) {
                //tx.executeSql('DROP TABLE IF EXISTS images');
                tx.executeSql('CREATE TABLE IF NOT EXISTS images (id integer primary key, imageId text, imageData text)');
            }, errorCb, successCb);
        };

        var dropTables = function () {
            if (!isSqliteDefined()) {
                return;
            }

            getDbConnection().transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS images');
            }, errorCb, successCb);
        };

        createTables();

        this.dropTablesAndRecreateSchema = function () {
            dropTables();
            createTables();
        };

        this.insertImage = function (imageId, imageData) {
            if (!isSqliteDefined()) {
                return;
            }

            var db = getDbConnection();
            db.transaction(function (tx) {
                var insertSql = "INSERT INTO images (imageId, imageData) VALUES (?,?)";
                tx.executeSql(insertSql, [imageId, imageData], function (tx, res) {
                    console.log("inserted new image with primary id: " + res.insertId);
                }, errorCb);

            }, errorCb, successCb);
        };

        this.updateImage = function (imageId, imageData) {
            if (!isSqliteDefined()) {
                return;
            }

            var db = getDbConnection();
            db.transaction(function (tx) {
                var updateSql = "UPDATE images SET imageData=? WHERE imageId=?";

                tx.executeSql(updateSql, [imageData, imageId], function (tx, res) {
                    console.log(res);
                }, errorCb);

            }, errorCb, successCb);
        };

        this.insertOrUpdateImage = function (imageId, imageData) {
            if (!isSqliteDefined()) {
                return;
            }

            var db = getDbConnection();
            db.transaction(function (tx) {
                tx.executeSql("select count(id) as cnt from images where imageId=?;", [imageId], function (tx, res) {
                    if (res.rows.length === 1 && res.rows.item(0).cnt === 1) {
                        self.updateImage(imageId, imageData);
                    } else if (res.rows.length === 1 && res.rows.item(0).cnt === 0) {
                        self.insertImage(imageId, imageData);
                    }
                }, errorCb);
            }, errorCb, successCb);
        };

        this.deleteImage = function (imageId, imageData) {
            if (!isSqliteDefined()) {
                return;
            }

            var db = getDbConnection();
            db.transaction(function (tx) {
                var deleteSql = "DELETE from images WHERE imageId=?";

                tx.executeSql(deleteSql, [imageId], function (tx, res) {
                    console.log(res);
                }, errorCb);

            }, errorCb, successCb);
        };

        this.getAllImages = function () {
            var deferred = $q.defer();
            if (!isSqliteDefined()) {
                window.setTimeout(function () {
                    var images = [];
                    deferred.resolve(images);
                }, 100);
                return deferred.promise;
            }

            var db = getDbConnection();
            db.readTransaction(function (tx) {
                tx.executeSql('SELECT * FROM images;', [], function (tx, res) {
                    var images = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        var image = res.rows.item(i);
                        images.push(image);
                    }
                    console.log("ALL IMAGES:", images);
                    deferred.resolve(images);
                }, errorCb);
            }, errorCb, successCb);
            return deferred.promise;
        };

        this.getImageByImageId = function (imageId) {
            var deferred = $q.defer();
            if (!isSqliteDefined()) {
                window.setTimeout(function () {
                    deferred.resolve(PlaceholderDataUrl);
                }, 100);
                return deferred.promise;
            }

            var db = getDbConnection();
            db.readTransaction(function (tx) {
                tx.executeSql('SELECT * FROM images WHERE imageId=?;', [imageId], function (tx, res) {
                    if (res.rows.length === 1) {
                        deferred.resolve(res.rows.item(0));
                    }
                }, errorCb);
            }, errorCb, successCb);
            return deferred.promise;
        };

        return this;
    };

    factory.$inject = ["$q", 'PlaceholderDataUrl'];
    return factory;
});