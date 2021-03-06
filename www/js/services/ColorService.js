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
                var tmp = h;
                if (h.length > 6)
                    tmp = h.substr(1, 6);
                var rgb = [hexToRed(tmp), hexToGreen(tmp), hexToBlue(tmp)];
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
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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
            getRawXYPointFromRGB = function (red, green, blue) {
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

                cx = isNaN(cx) ? 0.0 : cx; //black for example
                cy = isNaN(cy) ? 0.0 : cy;
                return new XYPoint(cx, cy);
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
                //Check if the given XY value is within the colourreach of our lamps.
                var xyPoint = getRawXYPointFromRGB(red, green, blue),
                    inReachOfLamps = checkPointInLampsReach(xyPoint);

                if (!inReachOfLamps) {
                    var closestPoint = getClosestPointToPoint(xyPoint);
                    xyPoint.x = closestPoint.x;
                    xyPoint.y = closestPoint.y;
                }

                return new XYPoint(xyPoint.x, xyPoint.y);
            },
            round = function (value, decimals) {
                return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
            },
            initGamut = function (gamut) {
                if (gamut === "A") {
                    initGamutA();
                } else if (gamut === "B") {
                    initGamutB();
                } else if (gamut === "C") {
                    initGamutC();
                } else {
                    initGamutX();
                }
            },
            gammaCorrect = function (x) {
                return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
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

                var z = 1.0 - xyPoint.x - xyPoint.y;
                var Y = bri; // The given brightness value
                var X = (Y / xyPoint.y) * xyPoint.x;
                var Z = (Y / xyPoint.y) * z;

                //                var Y = bri,
                //                    X = (Y / xyPoint.y) * xyPoint.x,
                //                    Z = (Y / xyPoint.y) * (1 - xyPoint.x - xyPoint.y);

                // Convert to RGB using Wide RGB D65 conversion.
                //                var rgb = [
                //                X * 1.656492 - Y * 0.354851 - Z * 0.255038,
                //                -X * 0.707196 + Y * 1.655397 + Z * 0.036152,
                //                X * 0.051713 - Y * 0.121364 + Z * 1.011530
                //            ];
                //
                //
                //                // Apply reverse gamma correction.
                //                rgb = rgb.map(function (x) {
                //                    return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
                //                });
                //
                //                // Bring all negative components to zero.
                //                rgb = rgb.map(function (x) {
                //                    return Math.max(0, x);
                //                });
                //
                //                // If one component is greater than 1, weight components by that value.
                //                var max = Math.max(rgb[0], rgb[1], rgb[2]);
                //                if (max > 1) {
                //                    rgb = rgb.map(function (x) {
                //                        return x / max;
                //                    });
                //                }
                //
                //
                //                rgb = rgb.map(function (x) {
                //                    return Math.floor(x * 255);
                //                });

                var r = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
                var g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
                var b = X * 0.051713 - Y * 0.121364 + Z * 1.011530;

                var rgb = [r, g, b];
                //Apply reverse gamma correction.
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
                //                if (r > b && r > g && r > 1.0) {
                //                    // red is too big
                //                    g = g / r;
                //                    b = b / r;
                //                    r = 1.0;
                //                } else if (g > b && g > r && g > 1.0) {
                //                    // green is too big
                //                    r = r / g;
                //                    b = b / g;
                //                    g = 1.0;
                //                } else if (b > r && b > g && b > 1.0) {
                //                    // blue is too big
                //                    r = r / b;
                //                    g = g / b;
                //                    b = 1.0;
                //                }
                //
                //                // Apply gamma correction
                //                r = gammaCorrect(r);
                //                g = gammaCorrect(g);
                //                b = gammaCorrect(b);
                //
                //                return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
            };

        /**
         * Publicly accessible functions exposed as API.
         */
        return {
            hueSatToHex: function (hue, sat) {
                var self = this;
                var bri = 140;

                var huePercentage = parseFloat(hue) / 65535.0;
                var satPercentage = parseFloat(sat) / 254.0;
                var briPercentage = parseFloat(bri) / 254.0;

                var h = 360 * huePercentage;
                var s = 100 * satPercentage;
                var l = 100 * briPercentage;

                var hexColor = this.hslToHex(h, s, l);

                var getRgb = function (hexColor) {
                    var rgb = self.hexToRgb(hexColor);
                    //Apply reverse gamma correction.
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
                var rgb = getRgb(hexColor);
                hexColor = rgbToHex(rgb[0], rgb[1], rgb[2]);

                return hexColor;
            },
            /**
             * Converts RGB color components to a valid hex color string.
             *
             * @param {Number} RGB red value, integer between 0 and 255.
             * @param {Number} RGB green value, integer between 0 and 255.
             * @param {Number} RGB blue value, integer between 0 and 255.
             * @returns {String} Hex color string (e.g. #FF0000)
             */
            rgbToHex: function (r, g, b) {
                return rgbToHex(r, g, b);
            },

            hexToRgb: function (hex) {
                return hexToRGB(hex);
            },
            hslToHex: function (hue, sat, lum) {
                var rgb = this.hslToRgb(hue, sat, lum);
                return rgbToHex(rgb[0], rgb[1], rgb[2]);
            },

            hslToRgb: function (hue, sat, lum) {

                var h = parseFloat(hue);
                var s = parseFloat(sat);
                var l = parseFloat(lum);
                if (h < 0) h = 0;
                if (s < 0) s = 0;
                if (l < 0) l = 0;
                if (h >= 360) h = 359;
                if (s > 100) s = 100;
                if (l > 100) l = 100;
                s /= 100;
                l /= 100;
                var C = (1 - Math.abs(2 * l - 1)) * s;
                var hh = h / 60;
                var X = C * (1 - Math.abs(hh % 2 - 1));
                var r = 0;
                var g = 0;
                var b = 0;

                if (hh >= 0 && hh < 1) {
                    r = C;
                    g = X;
                } else if (hh >= 1 && hh < 2) {
                    r = X;
                    g = C;
                } else if (hh >= 2 && hh < 3) {
                    g = C;
                    b = X;
                } else if (hh >= 3 && hh < 4) {
                    g = X;
                    b = C;
                } else if (hh >= 4 && hh < 5) {
                    r = X;
                    b = C;
                } else {
                    r = C;
                    b = X;
                }
                var m = l - C / 2;
                r += m;
                g += m;
                b += m;


                //                var rgb = [r, g, b];
                //                //Apply reverse gamma correction.
                //                rgb = rgb.map(function (x) {
                //                    return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
                //                });
                //
                //                // Bring all negative components to zero.
                //                rgb = rgb.map(function (x) {
                //                    return Math.max(0, x);
                //                });
                //
                //                // If one component is greater than 1, weight components by that value.
                //                var max = Math.max(rgb[0], rgb[1], rgb[2]);
                //                if (max > 1) {
                //                    rgb = rgb.map(function (x) {
                //                        return x / max;
                //                    });
                //                }
                //
                //                rgb = rgb.map(function (x) {
                //                    return Math.floor(x * 255);
                //                });
                //return rgb;

                r *= 255.0;
                g *= 255.0;
                b *= 255.0;
                r = Math.round(r);
                g = Math.round(g);
                b = Math.round(b);
                return [r, g, b];

            },

            hexToHsl: function (hex) {
                var rgb = hexToRGB(hex);
                var r = rgb[0];
                var g = rgb[1];
                var b = rgb[2];

                if (r < 0) r = 0;
                if (g < 0) g = 0;
                if (b < 0) b = 0;
                if (r > 255) r = 255;
                if (g > 255) g = 255;
                if (b > 255) b = 255;

                hex = r * 65536 + g * 256 + b;
                hex = hex.toString(16, 6);
                var len = hex.length;
                if (len < 6)
                    for (var i = 0; i < 6 - len; i++)
                        hex = '0' + hex;
                r /= 255;
                g /= 255;
                b /= 255;
                var M = Math.max(r, g, b);
                var m = Math.min(r, g, b);
                var d = M - m;
                var h, s, l;
                if (d === 0) h = 0;
                else if (M === r) h = ((g - b) / d) % 6;
                else if (M === g) h = (b - r) / d + 2;
                else h = (r - g) / d + 4;
                h *= 60;
                if (h < 0) h += 360;
                l = (M + m) / 2;
                if (d === 0)
                    s = 0;
                else
                    s = d / (1 - Math.abs(2 * l - 1));
                s *= 100;
                l *= 100;

                return {
                    h: parseFloat(h.toFixed(0)),
                    s: parseFloat(s.toFixed(1)),
                    l: parseFloat(l.toFixed(1))
                };
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
                initGamut(gamut);

                var point = getXYPointFromRGB(red, green, blue);
                return [round(point.x, 4), round(point.y, 4)];
                //return [point.x, point.y];
            },

            getXysFromHex: function (hexColor) {
                var hex = hexColor;
                if (hex.length == 7) {
                    hex = hex.substring(1, 7);
                }
                var rgb = hexToRGB(hex);
                var gamutAxy = this.rgbArrayToCIE1931("A", rgb);
                var gamutBxy = this.rgbArrayToCIE1931("B", rgb);
                var gamutCxy = this.rgbArrayToCIE1931("C", rgb);
                return {
                    hexColor: hexColor,
                    rgb: rgb,
                    gamutAxy: gamutAxy,
                    gamutBxy: gamutBxy,
                    gamutCxy: gamutCxy,
                };
            },

            getGamutXyFromHex: function (gamut, hexColor) {
                var hex = hexColor;
                if (hex.length == 7) {
                    hex = hex.substring(1, 7);
                }
                var rgb = hexToRGB(hex);
                return this.rgbArrayToCIE1931(gamut, rgb);
            },

            rgbArrayToCIE1931: function (gamut, rgb) {
                return this.rgbToCIE1931(gamut, rgb[0], rgb[1], rgb[2]);
            },

            checkPointInLampsReach: function (gamut, xy) {
                initGamut(gamut);
                return checkPointInLampsReach(new XYPoint(xy[0], xy[1]));
            },
            getRawXYPointFromRGB: function (rgb) {
                var xyPoint = getRawXYPointFromRGB(rgb[0], rgb[1], rgb[2]);
                return [xyPoint.x, xyPoint.y];
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
                initGamut(gamut);

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
                initGamut(gamut);
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