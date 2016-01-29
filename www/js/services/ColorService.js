/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function () {

        /**
         * Represents a CIE 1931 XY coordinate pair.
         *
         * @param {Number} X coordinate.
         * @param {Number} Y coordinate.
         * @constructor
         */
        var XYPoint = function (x, y) {
                this.x = x;
                this.y = y;
            },

            Red = new XYPoint(0.675, 0.322),
            Lime = new XYPoint(0.4091, 0.518),
            Blue = new XYPoint(0.167, 0.04),

            initGamutA = function () {
                Red = new XYPoint(0.704, 0.296);
                Lime = new XYPoint(0.2151, 0.7106);
                Blue = new XYPoint(0.138, 0.08);
            },
            initGamutB = function () {
                Red = new XYPoint(0.675, 0.322);
                Lime = new XYPoint(0.4091, 0.518);
                Blue = new XYPoint(0.167, 0.04);
            },
            initGamutC = function () {
                Red = new XYPoint(0.692, 0.308);
                Lime = new XYPoint(0.17, 0.7);
                Blue = new XYPoint(0.153, 0.048);
            },
            initGamutX = function () {
                Red = new XYPoint(1.0, 0);
                Lime = new XYPoint(0.0, 1.0);
                Blue = new XYPoint(0.0, 0.0);
            },

            /**
             * Parses a valid hex color string and returns the Red RGB integer value.
             *
             * @param {String} Hex color string.
             * @return {Number} Red integer value.
             */
            hexToRed = function (hex) {
                return parseInt(hex.substring(0, 2), 16);
            },

            /**
             * Parses a valid hex color string and returns the Green RGB integer value.
             *
             * @param {String} Hex color string.
             * @return {Number} Green integer value.
             */
            hexToGreen = function (hex) {
                return parseInt(hex.substring(2, 4), 16);
            },

            /**
             * Parses a valid hex color string and returns the Blue RGB integer value.
             *
             * @param {String} Hex color string.
             * @return {Number} Blue integer value.
             */
            hexToBlue = function (hex) {
                return parseInt(hex.substring(4, 6), 16);
            },

            /**
             * Converts a valid hex color string to an RGB array.
             *
             * @param {String} Hex color String (e.g. FF00FF)
             * @return {Array} Array containing R, G, B values
             */
            hexToRGB = function (h) {
                var rgb = [hexToRed(h), hexToGreen(h), hexToBlue(h)];
                return rgb;
            },

            /**
             * Converts an RGB component to a hex string.
             *
             * @param {Number} RGB value, integer between 0 and 255.
             * @returns {String} Hex value string (e.g. FF)
             */
            componentToHex = function (c) {
                var hex = c.toString(16);
                return hex.length == 1 ? '0' + hex : hex;
            },

            /**
             * Converts RGB color components to a valid hex color string.
             *
             * @param {Number} RGB red value, integer between 0 and 255.
             * @param {Number} RGB green value, integer between 0 and 255.
             * @param {Number} RGB blue value, integer between 0 and 255.
             * @returns {String} Hex color string (e.g. FF0000)
             */
            rgbToHex = function (r, g, b) {
                return componentToHex(r) + componentToHex(g) + componentToHex(b);
            },

            /**
             * Generates a random number between 'from' and 'to'.
             *
             * @param {Number} Number representing the start of a range.
             * @param {Number} Number representing the end of a range.
             */
            randomFromInterval = function (from /* Number */ , to /* Number */ ) {
                return Math.floor(Math.random() * (to - from + 1) + from);
            },

            /**
             * Return a random Integer in the range of 0 to 255, representing an RGB
             * color value.
             *
             * @return {number} Integer between 0 and 255.
             */
            randomRGBValue = function () {
                return randomFromInterval(0, 255);
            },

            /**
             * Returns the cross product of two XYPoints.
             *
             * @param {XYPoint} Point 1.
             * @param {XYPoint} Point 2.
             * @return {Number} Cross-product of the two XYPoints provided.
             */
            crossProduct = function (p1, p2) {
                return (p1.x * p2.y - p1.y * p2.x);
            },

            /**
             * Check if the provided XYPoint can be recreated by a Hue lamp.
             *
             * @param {XYPoint} XYPoint to check.
             * @return {boolean} Flag indicating if the point is within reproducible range.
             */
            checkPointInLampsReach = function (p) {
                var v1 = new XYPoint(Lime.x - Red.x, Lime.y - Red.y),
                    v2 = new XYPoint(Blue.x - Red.x, Blue.y - Red.y),

                    q = new XYPoint(p.x - Red.x, p.y - Red.y),

                    s = crossProduct(q, v2) / crossProduct(v1, v2),
                    t = crossProduct(v1, q) / crossProduct(v1, v2);

                return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
            },

            /**
             * Find the closest point on a line. This point will be reproducible by a Hue lamp.
             *
             * @param {XYPoint} The point where the line starts.
             * @param {XYPoint} The point where the line ends.
             * @param {XYPoint} The point which is close to the line.
             * @return {XYPoint} A point that is on the line, and closest to the XYPoint provided.
             */
            getClosestPointToLine = function (A, B, P) {
                var AP = new XYPoint(P.x - A.x, P.y - A.y),
                    AB = new XYPoint(B.x - A.x, B.y - A.y),
                    ab2 = AB.x * AB.x + AB.y * AB.y,
                    ap_ab = AP.x * AB.x + AP.y * AB.y,
                    t = ap_ab / ab2;

                if (t < 0.0) {
                    t = 0.0;
                } else if (t > 1.0) {
                    t = 1.0;
                }

                return new XYPoint(A.x + AB.x * t, A.y + AB.y * t);
            },

            getClosestPointToPoint = function (xyPoint) {
                // Color is unreproducible, find the closest point on each line in the CIE 1931 'triangle'.
                var pAB = getClosestPointToLine(Red, Lime, xyPoint),
                    pAC = getClosestPointToLine(Blue, Red, xyPoint),
                    pBC = getClosestPointToLine(Lime, Blue, xyPoint),

                    // Get the distances per point and see which point is closer to our Point.
                    dAB = getDistanceBetweenTwoPoints(xyPoint, pAB),
                    dAC = getDistanceBetweenTwoPoints(xyPoint, pAC),
                    dBC = getDistanceBetweenTwoPoints(xyPoint, pBC),

                    lowest = dAB,
                    closestPoint = pAB;

                if (dAC < lowest) {
                    lowest = dAC;
                    closestPoint = pAC;
                }

                if (dBC < lowest) {
                    lowest = dBC;
                    closestPoint = pBC;
                }

                return closestPoint;
            },

            /**
             * Returns the distance between two XYPoints.
             *
             * @param {XYPoint} The first point.
             * @param {XYPoint} The second point.
             * @param {Number} The distance between points one and two.
             */
            getDistanceBetweenTwoPoints = function (one, two) {
                var dx = one.x - two.x, // horizontal difference
                    dy = one.y - two.y; // vertical difference

                return Math.sqrt(dx * dx + dy * dy);
            },

            /**
             * Returns an XYPoint object containing the closest available CIE 1931
             * coordinates based on the RGB input values.
             *
             * @param {Number} RGB red value, integer between 0 and 255.
             * @param {Number} RGB green value, integer between 0 and 255.
             * @param {Number} RGB blue value, integer between 0 and 255.
             * @return {XYPoint} CIE 1931 XY coordinates, corrected for reproducibility.
             */
            getXYPointFromRGB = function (red, green, blue) {
                red = (red / 255.0);
                green = (green / 255.0);
                blue = (blue / 255.0);


                var r = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
                var g = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
                var b = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

                var X = r * 0.664511 + g * 0.154324 + b * 0.162028;
                var Y = r * 0.283881 + g * 0.668433 + b * 0.047685;
                var Z = r * 0.000088 + g * 0.072310 + b * 0.986039;

                var cx = X / (X + Y + Z);
                var cy = Y / (X + Y + Z);
                console.log(new XYPoint(cx, cy));
                cx = isNaN(cx) ? 0.0 : cx;
                cy = isNaN(cy) ? 0.0 : cy;

                //Check if the given XY value is within the colourreach of our lamps.
                var xyPoint = new XYPoint(cx, cy),
                    inReachOfLamps = checkPointInLampsReach(xyPoint);

                if (!inReachOfLamps) {
                    var closestPoint = getClosestPointToPoint(xyPoint);
                    cx = closestPoint.x;
                    cy = closestPoint.y;
                }

                return new XYPoint(cx, cy);
            },
            round = function (value, decimals) {
                return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
            },
            /**
             * Returns a rgb array for given x, y values. Not actually an inverse of
             * getXYPointFromRGB. Implementation of the instructions found on the
             * Philips Hue iOS SDK docs: http://goo.gl/kWKXKl
             */
            getRGBFromXYAndBrightness = function (x, y, bri) {
                var xyPoint = new XYPoint(x, y);

                if (bri === undefined) {
                    bri = 1;
                }

                // Check if the xy value is within the color gamut of the lamp.
                // If not continue with step 2, otherwise step 3.
                // We do this to calculate the most accurate color the given light can actually do.
                if (!checkPointInLampsReach(xyPoint)) {
                    // Calculate the closest point on the color gamut triangle
                    // and use that as xy value See step 6 of color to xy.
                    xyPoint = getClosestPointToPoint(xyPoint);
                }

                // Calculate XYZ values Convert using the following formulas:
                var Y = bri,
                    X = (Y / xyPoint.y) * xyPoint.x,
                    Z = (Y / xyPoint.y) * (1 - xyPoint.x - xyPoint.y);

                // Convert to RGB using Wide RGB D65 conversion.
                var rgb = [
                X * 1.612 - Y * 0.203 - Z * 0.302,
                -X * 0.509 + Y * 1.412 + Z * 0.066,
                X * 0.026 - Y * 0.072 + Z * 0.962
            ];

                // Apply reverse gamma correction.
                rgb = rgb.map(function (x) {
                    return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
                });

                // Bring all negative components to zero.
                rgb = rgb.map(function (x) {
                    return Math.max(0, x);
                });

                // If one component is greater than 1, weight components by that value.
                var max = Math.max(rgb[0], rgb[1], rgb[2]);
                if (max > 1) {
                    rgb = rgb.map(function (x) {
                        return x / max;
                    });
                }

                rgb = rgb.map(function (x) {
                    return Math.floor(x * 255);
                });

                return rgb;
            };

        /**
         * Publicly accessible functions exposed as API.
         */
        return {

            /**
             * Converts RGB color components to a valid hex color string.
             *
             * @param {Number} RGB red value, integer between 0 and 255.
             * @param {Number} RGB green value, integer between 0 and 255.
             * @param {Number} RGB blue value, integer between 0 and 255.
             * @returns {String} Hex color string (e.g. FF0000)
             */
            rgbToHex: function (r, g, b) {
                return rgbToHex(r, g, b);
            },

            /**
             * Converts hexadecimal colors represented as a String to approximate
             * CIE 1931 coordinates. May not produce accurate values.
             *
             * @param {String} Value representing a hexadecimal color value
             * @return {Array{Number}} Approximate CIE 1931 x,y coordinates.
             */
            hexToCIE1931: function (h) {
                var rgb = hexToRGB(h);
                return this.rgbToCIE1931(rgb[0], rgb[1], rgb[2]);
            },

            /**
             * Converts red, green and blue integer values to approximate CIE 1931
             * x and y coordinates. Algorithm from:
             * http://www.easyrgb.com/index.php?X=MATH&H=02#text2. May not produce
             * accurate values.
             *
             * @param {Number} red Integer in the 0-255 range.
             * @param {Number} green Integer in the 0-255 range.
             * @param {Number} blue Integer in the 0-255 range.
             * @return {Array{Number}} Approximate CIE 1931 x,y coordinates.
             */
            rgbToCIE1931: function (gamut, red, green, blue) {
                if (gamut === "A") {
                    initGamutA();
                } else if (gamut === "B") {
                    initGamutB();
                } else if (gamut === "C") {
                    initGamutC();
                } else {
                    initGamutX();
                }

                var point = getXYPointFromRGB(red, green, blue);
                return [round(point.x, 4), round(point.y, 4)];
                //return [point.x, point.y];
            },

            rgbArrayToCIE1931: function (gamut, rgb) {
                return this.rgbToCIE1931(gamut, rgb[0], rgb[1], rgb[2]);
            },

            /**
             * Returns the approximate CIE 1931 x,y coordinates represented by the
             * supplied hexColor parameter, or of a random color if the parameter
             * is not passed.
             *
             * @param {String} hexColor String representing a hexidecimal color value.
             * @return {Array{Number}} Approximate CIE 1931 x,y coordinates.
             */
            getCIEColor: function (gamut, hexColor) {
                if (gamut === "A") {
                    initGamutA();
                } else if (gamut === "B") {
                    initGamutB();
                } else if (gamut === "C") {
                    initGamutC();
                } else {
                    initGamutX();
                }

                var hex = hexColor || null,
                    xy = [];
                if (null !== hex) {
                    xy = this.hexToCIE1931(hex);
                } else {
                    var r = randomRGBValue(),
                        g = randomRGBValue(),
                        b = randomRGBValue();
                    xy = this.rgbToCIE1931(r, g, b);
                }
                return xy;
            },

            /**
             * Returns the approximate hexColor represented by the supplied
             * CIE 1931 x,y coordinates and brightness value.
             *
             * @param {String} Gamut mode
             * @param {Number} X coordinate.
             * @param {Number} Y coordinate.
             * @param {Number} brightness value expressed between 0 and 1.
             * @return {String} hex color string.
             */
            CIE1931ToHex: function (gamut, x, y, bri) {
                if (gamut === "A") {
                    initGamutA();
                } else if (gamut === "B") {
                    initGamutB();
                } else if (gamut === "C") {
                    initGamutC();
                } else {
                    initGamutX();
                }
                if (bri === undefined) {
                    bri = 1;
                }
                var rgb = getRGBFromXYAndBrightness(x, y, bri);
                return rgbToHex(rgb[0], rgb[1], rgb[2]);
            },

            hexFullRed: "FF0000",
            hexFullGreen: "00FF00",
            hexFullBlue: "0000FF",
            hexFullWhite: "FFFFFF"
        };
    };

    factory.$inject = [];
    return factory;
});
