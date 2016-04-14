/*global define, console, window */

define(['angular'], function (angular) {
    "use strict";

    var factory = function ($q, PlaceholderDataUrl, ColorService) {
        var self = this;
        var db = null;

        this.calc = function (raster) {

            //v0=b
            //v1=r
            //v2=g
            var doCalc = function (rasterSize, v0x, v0y, v1x, v1y, v2x, v2y, gamut) {

                var orient2d = function (aX, aY, bX, bY, cX, cY) {
                    return (bX - aX) * (cY - aY) - (bY - aY) * (cX - aX);
                };

                var min3 = function (v0x, v1x, v2x) {
                    var retVal = v0x;
                    if (v1x < retVal)
                        retVal = v1x;
                    if (v2x < retVal)
                        retVal = v1x;
                    return retVal;
                };

                var max3 = function (v0x, v1x, v2x) {
                    var retVal = v0x;
                    if (v1x > retVal)
                        retVal = v1x;
                    if (v2x > retVal)
                        retVal = v1x;
                    return retVal;
                };

                var min = function (a, b) {
                    return (a > b) ? a : b;
                };

                var max = function (a, b) {
                    return (a < b) ? b : a;
                };

                var count = 0;
                var tmp = {};
                var renderPixel = function (xy) {
                    count++;
                    var hexColor = "#" + ColorService.CIE1931ToHex(gamut, xy[0], xy[1], 1);
                    if (!(hexColor in tmp))
                        tmp[hexColor] = {
                            x: xy[0],
                            y: xy[1],
                            hex: hexColor,
                            isReachableByGamutA: false,
                            isReachableByGamutB: false,
                            isReachableByGamutC: false,
                        };
                };

                // Compute triangle bounding box
                var minX = min3(v0x, v1x, v2x);
                var minY = min3(v0y, v1y, v2y);
                var maxX = max3(v0x, v1x, v2x);
                var maxY = max3(v0y, v1y, v2y);

                // Clip against screen bounds
                minX = max(minX, 0);
                minY = max(minY, 0);
                maxX = min(maxX, 0.9);
                maxY = min(maxY, 0.9);

                var px, py;
                for (py = minY; py <= maxY; py = py + rasterSize) {
                    for (px = minX; px <= maxX; px = px + rasterSize) {
                        // Determine barycentric coordinates
                        var w0 = orient2d(v1x, v1y, v2x, v2y, px, py);
                        var w1 = orient2d(v2x, v2y, v0x, v0y, px, py);
                        var w2 = orient2d(v0x, v0y, v1x, v1y, px, py);

                        // If p is on or inside all edges, render pixel.
                        if (w0 >= 0 && w1 >= 0 && w2 >= 0)
                            renderPixel([px, py]);
                    }
                }

                return tmp;
            };

            var Red = [1.0, 0.0];
            var Green = [0.0, 1.0];
            var Blue = [0.0, 0.0];

            var initGamutA = function () {
                    Red = [0.704, 0.296];
                    Green = [0.2151, 0.7106];
                    Blue = [0.138, 0.08];
                },
                initGamutB = function () {
                    Red = [0.675, 0.322];
                    Green = [0.4091, 0.518];
                    Blue = [0.167, 0.04];
                },
                initGamutC = function () {
                    Red = [0.692, 0.308];
                    Green = [0.17, 0.7];
                    Blue = [0.153, 0.048];
                };

            initGamutC();
            var allColors = {};
            allColors = doCalc(raster, Blue[0], Blue[1], Red[0], Red[1], Green[0], Green[1], "C");
            angular.forEach(allColors, function (value, key) {
                value.isReachableByGamutC = true;
            });
            console.log(Object.keys(allColors).length);


            initGamutB();
            var allColorsGamutB = doCalc(raster, Blue[0], Blue[1], Red[0], Red[1], Green[0], Green[1], "B");
            angular.forEach(allColorsGamutB, function (value, key) {
                if (key in allColors) {
                    allColors[key].isReachableByGamutB = true;
                } else {
                    value.isReachableByGamutB = true;
                    allColors[key] = value;
                }
            });
            allColorsGamutB = undefined;
            console.log(Object.keys(allColors).length);


            initGamutA();
            var allColorsGamutA = doCalc(raster, Blue[0], Blue[1], Red[0], Red[1], Green[0], Green[1], "A");
            angular.forEach(allColorsGamutA, function (value, key) {
                if (key in allColors) {
                    allColors[key].isReachableByGamutA = true;
                } else {
                    value.isReachableByGamutA = true;
                    allColors[key] = value;
                }
            });
            allColorsGamutA = undefined;
            console.log(Object.keys(allColors).length);

            return allColors;
        };

        this.initColorsTable = function () {
            var colors = self.calc(0.005);
            console.info("Anzahl Farben: ", Object.keys(colors).length);

            if (!isSqliteDefined()) {
                return;
            }

            //            var db = getDbConnection();
            //            db.sqlBatch([
            //              'DROP TABLE IF EXISTS colors',
            //              'CREATE TABLE IF NOT EXISTS colors (id integer primary key, x real, y real, hex text, isReachableByGamutA integer, isReachableByGamutB integer, isReachableByGamutC integer)',
            //            ], function () {
            //                db.executeSql('SELECT Count(*) as cnt FROM colors', [], function (res) {
            //                    console.log('Items in colors table: ' + res.rows.item(0).cnt);
            //                });
            //            }, function (error) {
            //                console.log('Populate table error: ' + error.message);
            //            });

            function generateColorInsertStatement(color) {
                var insertSql = "INSERT INTO colors (id,x, y, hex, isReachableByGamutA, isReachableByGamutB, isReachableByGamutC) VALUES (?,?,?,?,?,?,?)";
                var id = parseInt(color.hex.replace("#", ""), 16);

                return [insertSql, [id, color.x, color.y, color.hex, color.isReachableByGamutA, color.isReachableByGamutB, color.isReachableByGamutC]];
            }

            var insertQueries = [];

            angular.forEach(colors, function (color, key) {
                //insertQueries.push(generateColorInsertStatement(value));
                var id = parseInt(color.hex.replace("#", ""), 16);
                self.insertColor(id, color.x, color.y, color.hex, color.isReachableByGamutA, color.isReachableByGamutB, color.isReachableByGamutC);
            });



            //console.log(insertQueries);

        };

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
                    location: 'default',
                    createFromLocation: 1
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
                //tx.executeSql('CREATE TABLE IF NOT EXISTS colors (id integer primary key, x real, y real, hex text, isReachableByGamutA integer, isReachableByGamutB integer, isReachableByGamutC integer)');
            }, errorCb, successCb);


        };

        var dropTables = function () {
            if (!isSqliteDefined()) {
                return;
            }

            getDbConnection().transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS images');
                //tx.executeSql('DROP TABLE IF EXISTS colors');
            }, errorCb, successCb);
        };

        createTables();

        this.dropTablesAndRecreateSchema = function () {
            dropTables();
            createTables();
        };

        this.insertColor = function (id, x, y, hex, isReachableByGamutA, isReachableByGamutB, isReachableByGamutC) {
            if (!isSqliteDefined()) {
                return;
            }

            var db = getDbConnection();
            db.transaction(function (tx) {
                var insertSql = "INSERT INTO colors (id,x, y, hex, isReachableByGamutA, isReachableByGamutB, isReachableByGamutC) VALUES (?,?,?,?,?,?,?)";
                tx.executeSql(insertSql, [id, x, y, hex, isReachableByGamutA, isReachableByGamutB, isReachableByGamutC], function (tx, res) {
                    //console.log("inserted new image with primary id: " + res.insertId);
                }, errorCb);

            }, errorCb, successCb);
        };

        this.countColors = function (imageId, imageData) {
            if (!isSqliteDefined()) {
                return;
            }

            var db = getDbConnection();
            db.transaction(function (tx) {
                tx.executeSql("select count(id) as cnt from colors;", [], function (tx, res) {
                    console.log("colors:", res.rows.item(0).cnt);
                }, errorCb);
            }, errorCb, successCb);
        };

        this.getColorByImageId = function (id) {
            var deferred = $q.defer();
            if (!isSqliteDefined()) {
                window.setTimeout(function () {
                    deferred.resolve(PlaceholderDataUrl);
                }, 100);
                return deferred.promise;
            }

            var db = getDbConnection();
            db.readTransaction(function (tx) {
                tx.executeSql('SELECT * FROM colors WHERE id=?;', [id], function (tx, res) {
                    if (res.rows.length === 1) {
                        deferred.resolve(res.rows.item(0));
                    }
                }, errorCb);
            }, errorCb, successCb);
            return deferred.promise;
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

    factory.$inject = ["$q", 'PlaceholderDataUrl', 'ColorService'];
    return factory;
});
