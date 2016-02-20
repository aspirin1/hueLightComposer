/*global define, console */

define(['angular'], function (angular) {
    "use strict";

    var factory = function (ColorService) {
        var self = this;
        var colors = [
            {
                "name": "Alice Blue",
                "rgb": [239, 247, 255],
                "gamutA": [0.3088, 0.3212],
                "gamutB": [0.3092, 0.321],
                "gamutC": [0.3088, 0.3212],
                "hexColor": "#eff7ff"
        },
            {
                "name": "Alice Blue",
                "rgb": [239, 247, 255],
                "gamutA": [0.3088, 0.3212],
                "gamutB": [0.3092, 0.321],
                "gamutC": [0.3088, 0.3212],
                "hexColor": "#eff7ff"
        }, {
                "name": "Antique White",
                "rgb": [249, 234, 214],
                "gamutA": [0.3548, 0.3489],
                "gamutB": [0.3548, 0.3489],
                "gamutC": [0.3548, 0.3489],
                "hexColor": "#f9ead6"
        }, {
                "name": "Aqua",
                "rgb": [0, 255, 255],
                "gamutA": [0.17, 0.3403],
                "gamutB": [0.2858, 0.2747],
                "gamutC": [0.1607, 0.3423],
                "hexColor": "#00ffff"
        }, {
                "name": "Aquamarine",
                "rgb": [127, 255, 211],
                "gamutA": [0.2138, 0.4051],
                "gamutB": [0.3237, 0.3497],
                "gamutC": [0.2138, 0.4051],
                "hexColor": "#7fffd3"
        }, {
                "name": "Azure",
                "rgb": [239, 255, 255],
                "gamutA": [0.3059, 0.3303],
                "gamutB": [0.3123, 0.3271],
                "gamutC": [0.3059, 0.3303],
                "hexColor": "#efffff"
        }, {
                "name": "Beige",
                "rgb": [244, 244, 219],
                "gamutA": [0.3402, 0.356],
                "gamutB": [0.3402, 0.356],
                "gamutC": [0.3402, 0.356],
                "hexColor": "#f4f4db"
        }, {
                "name": "Bisque",
                "rgb": [255, 226, 196],
                "gamutA": [0.3806, 0.3576],
                "gamutB": [0.3806, 0.3576],
                "gamutC": [0.3806, 0.3576],
                "hexColor": "#ffe2c4"
        }, {
                "name": "Blanched Almond",
                "rgb": [255, 234, 204],
                "gamutA": [0.3695, 0.3584],
                "gamutB": [0.3695, 0.3584],
                "gamutC": [0.3695, 0.3584],
                "hexColor": "#ffeacc"
        }, {
                "name": "Blue",
                "rgb": [0, 0, 255],
                "gamutA": [0.139, 0.081],
                "gamutB": [0.168, 0.041],
                "gamutC": [0.153, 0.048],
                "hexColor": "#0000ff"
        }, {
                "name": "Blue Violet",
                "rgb": [137, 43, 226],
                "gamutA": [0.245, 0.1214],
                "gamutB": [0.251, 0.1056],
                "gamutC": [0.251, 0.1056],
                "hexColor": "#892be2"
        }, {
                "name": "Brown",
                "rgb": [165, 40, 40],
                "gamutA": [0.6399, 0.3041],
                "gamutB": [0.6399, 0.3041],
                "gamutC": [0.6399, 0.3041],
                "hexColor": "#a52828"
        }, {
                "name": "Burlywood",
                "rgb": [221, 183, 135],
                "gamutA": [0.4236, 0.3811],
                "gamutB": [0.4236, 0.3811],
                "gamutC": [0.4236, 0.3811],
                "hexColor": "#ddb787"
        }, {
                "name": "Cadet Blue",
                "rgb": [94, 158, 160],
                "gamutA": [0.2211, 0.3328],
                "gamutB": [0.2961, 0.295],
                "gamutC": [0.2211, 0.3328],
                "hexColor": "#5e9ea0"
        }, {
                "name": "Chartreuse",
                "rgb": [127, 255, 0],
                "gamutA": [0.2682, 0.6632],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.2505, 0.6395],
                "hexColor": "#7fff00"
        }, {
                "name": "Chocolate",
                "rgb": [209, 104, 30],
                "gamutA": [0.6009, 0.3684],
                "gamutB": [0.6009, 0.3684],
                "gamutC": [0.6009, 0.3684],
                "hexColor": "#d1681e"
        }, {
                "name": "Coral",
                "rgb": [255, 127, 79],
                "gamutA": [0.5763, 0.3486],
                "gamutB": [0.5763, 0.3486],
                "gamutC": [0.5763, 0.3486],
                "hexColor": "#ff7f4f"
        }, {
                "name": "Cornflower",
                "rgb": [99, 147, 237],
                "gamutA": [0.1905, 0.1945],
                "gamutB": [0.2343, 0.1725],
                "gamutC": [0.1905, 0.1945],
                "hexColor": "#6393ed"
        }, {
                "name": "Cornsilk",
                "rgb": [255, 247, 219],
                "gamutA": [0.3511, 0.3574],
                "gamutB": [0.3511, 0.3574],
                "gamutC": [0.3511, 0.3574],
                "hexColor": "#fff7db"
        }, {
                "name": "Crimson",
                "rgb": [219, 20, 61],
                "gamutA": [0.6531, 0.2834],
                "gamutB": [0.6417, 0.304],
                "gamutC": [0.6508, 0.2881],
                "hexColor": "#db143d"
        }, {
                "name": "Cyan",
                "rgb": [0, 255, 255],
                "gamutA": [0.17, 0.3403],
                "gamutB": [0.2858, 0.2747],
                "gamutC": [0.1607, 0.3423],
                "hexColor": "#00ffff"
        }, {
                "name": "Dark Blue",
                "rgb": [0, 0, 140],
                "gamutA": [0.139, 0.081],
                "gamutB": [0.168, 0.041],
                "gamutC": [0.153, 0.048],
                "hexColor": "#00008c"
        }, {
                "name": "Dark Cyan",
                "rgb": [0, 140, 140],
                "gamutA": [0.17, 0.3403],
                "gamutB": [0.2858, 0.2747],
                "gamutC": [0.1607, 0.3423],
                "hexColor": "#008c8c"
        }, {
                "name": "Dark Goldenrod",
                "rgb": [183, 135, 10],
                "gamutA": [0.5265, 0.4428],
                "gamutB": [0.5204, 0.4346],
                "gamutC": [0.5214, 0.4361],
                "hexColor": "#b7870a"
        }, {
                "name": "Dark Gray",
                "rgb": [168, 168, 168],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#a8a8a8"
        }, {
                "name": "Dark Green",
                "rgb": [0, 99, 0],
                "gamutA": [0.214, 0.709],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.17, 0.7],
                "hexColor": "#006300"
        }, {
                "name": "Dark Khaki",
                "rgb": [188, 183, 107],
                "gamutA": [0.4004, 0.4331],
                "gamutB": [0.4004, 0.4331],
                "gamutC": [0.4004, 0.4331],
                "hexColor": "#bcb76b"
        }, {
                "name": "Dark Magenta",
                "rgb": [140, 0, 140],
                "gamutA": [0.3787, 0.1724],
                "gamutB": [0.3824, 0.1601],
                "gamutC": [0.3833, 0.1591],
                "hexColor": "#8c008c"
        }, {
                "name": "Dark Olive Green",
                "rgb": [84, 107, 45],
                "gamutA": [0.3475, 0.5047],
                "gamutB": [0.3908, 0.4829],
                "gamutC": [0.3475, 0.5047],
                "hexColor": "#546b2d"
        }, {
                "name": "Dark Orange",
                "rgb": [255, 140, 0],
                "gamutA": [0.5951, 0.3872],
                "gamutB": [0.5916, 0.3824],
                "gamutC": [0.5921, 0.3831],
                "hexColor": "#ff8c00"
        }, {
                "name": "Dark Orchid",
                "rgb": [153, 51, 204],
                "gamutA": [0.296, 0.1409],
                "gamutB": [0.2986, 0.1341],
                "gamutC": [0.2986, 0.1341],
                "hexColor": "#9933cc"
        }, {
                "name": "Dark Red",
                "rgb": [140, 0, 0],
                "gamutA": [0.7, 0.2986],
                "gamutB": [0.674, 0.322],
                "gamutC": [0.692, 0.308],
                "hexColor": "#8c0000"
        }, {
                "name": "Dark Salmon",
                "rgb": [232, 150, 122],
                "gamutA": [0.4837, 0.3479],
                "gamutB": [0.4837, 0.3479],
                "gamutC": [0.4837, 0.3479],
                "hexColor": "#e8967a"
        }, {
                "name": "Dark Sea Green",
                "rgb": [142, 188, 142],
                "gamutA": [0.2924, 0.4134],
                "gamutB": [0.3429, 0.3879],
                "gamutC": [0.2924, 0.4134],
                "hexColor": "#8ebc8e"
        }, {
                "name": "Dark Slate Blue",
                "rgb": [71, 61, 140],
                "gamutA": [0.2206, 0.1484],
                "gamutB": [0.2218, 0.1477],
                "gamutC": [0.2206, 0.1484],
                "hexColor": "#473d8c"
        }, {
                "name": "Dark Slate Gray",
                "rgb": [45, 79, 79],
                "gamutA": [0.2239, 0.3368],
                "gamutB": [0.2982, 0.2993],
                "gamutC": [0.2239, 0.3368],
                "hexColor": "#2d4f4f"
        }, {
                "name": "Dark Turquoise",
                "rgb": [0, 206, 209],
                "gamutA": [0.1693, 0.3347],
                "gamutB": [0.2835, 0.2701],
                "gamutC": [0.1605, 0.3366],
                "hexColor": "#00ced1"
        }, {
                "name": "Dark Violet",
                "rgb": [147, 0, 211],
                "gamutA": [0.2742, 0.1326],
                "gamutB": [0.2836, 0.1079],
                "gamutC": [0.2824, 0.1104],
                "hexColor": "#9300d3"
        }, {
                "name": "Deep Pink",
                "rgb": [255, 20, 147],
                "gamutA": [0.5454, 0.2359],
                "gamutB": [0.5386, 0.2468],
                "gamutC": [0.5445, 0.2369],
                "hexColor": "#ff1493"
        }, {
                "name": "Deep Sky Blue",
                "rgb": [0, 191, 255],
                "gamutA": [0.1576, 0.2368],
                "gamutB": [0.2428, 0.1893],
                "gamutC": [0.158, 0.2379],
                "hexColor": "#00bfff"
        }, {
                "name": "Dim Gray",
                "rgb": [104, 104, 104],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#686868"
        }, {
                "name": "Dodger Blue",
                "rgb": [30, 142, 255],
                "gamutA": [0.1484, 0.1599],
                "gamutB": [0.2115, 0.1273],
                "gamutC": [0.1559, 0.1599],
                "hexColor": "#1e8eff"
        }, {
                "name": "Firebrick",
                "rgb": [178, 33, 33],
                "gamutA": [0.6621, 0.3023],
                "gamutB": [0.6566, 0.3123],
                "gamutC": [0.6621, 0.3023],
                "hexColor": "#b22121"
        }, {
                "name": "Floral White",
                "rgb": [255, 249, 239],
                "gamutA": [0.3361, 0.3388],
                "gamutB": [0.3361, 0.3388],
                "gamutC": [0.3361, 0.3388],
                "hexColor": "#fff9ef"
        }, {
                "name": "Forest Green",
                "rgb": [33, 140, 33],
                "gamutA": [0.2097, 0.6732],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.1984, 0.6746],
                "hexColor": "#218c21"
        }, {
                "name": "Gainsboro",
                "rgb": [219, 219, 219],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#dbdbdb"
        }, {
                "name": "Ghost White",
                "rgb": [247, 247, 255],
                "gamutA": [0.3174, 0.3207],
                "gamutB": [0.3174, 0.3207],
                "gamutC": [0.3174, 0.3207],
                "hexColor": "#f7f7ff"
        }, {
                "name": "Gold",
                "rgb": [255, 214, 0],
                "gamutA": [0.4947, 0.472],
                "gamutB": [0.4859, 0.4599],
                "gamutC": [0.4871, 0.4618],
                "hexColor": "#ffd600"
        }, {
                "name": "Goldenrod",
                "rgb": [216, 165, 33],
                "gamutA": [0.5136, 0.4444],
                "gamutB": [0.5113, 0.4413],
                "gamutC": [0.5125, 0.4428],
                "hexColor": "#d8a521"
        }, {
                "name": "Gray",
                "rgb": [191, 191, 191],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#bfbfbf"
        }, {
                "name": "Web Gray",
                "rgb": [127, 127, 127],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#7f7f7f"
        }, {
                "name": "Green",
                "rgb": [0, 255, 0],
                "gamutA": [0.214, 0.709],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.17, 0.7],
                "hexColor": "#00ff00"
        }, {
                "name": "Web Green",
                "rgb": [0, 127, 0],
                "gamutA": [0.214, 0.709],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.17, 0.7],
                "hexColor": "#007f00"
        }, {
                "name": "Green Yellow",
                "rgb": [173, 255, 45],
                "gamutA": [0.3298, 0.5959],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.3221, 0.5857],
                "hexColor": "#adff2d"
        }, {
                "name": "Honeydew",
                "rgb": [239, 255, 239],
                "gamutA": [0.316, 0.3477],
                "gamutB": [0.3213, 0.345],
                "gamutC": [0.316, 0.3477],
                "hexColor": "#efffef"
        }, {
                "name": "Hot Pink",
                "rgb": [255, 104, 181],
                "gamutA": [0.4682, 0.2452],
                "gamutB": [0.4682, 0.2452],
                "gamutC": [0.4682, 0.2452],
                "hexColor": "#ff68b5"
        }, {
                "name": "Indian Red",
                "rgb": [204, 91, 91],
                "gamutA": [0.5488, 0.3112],
                "gamutB": [0.5488, 0.3112],
                "gamutC": [0.5488, 0.3112],
                "hexColor": "#cc5b5b"
        }, {
                "name": "Indigo",
                "rgb": [73, 0, 130],
                "gamutA": [0.2332, 0.1169],
                "gamutB": [0.2437, 0.0895],
                "gamutC": [0.2428, 0.0913],
                "hexColor": "#490082"
        }, {
                "name": "Ivory",
                "rgb": [255, 255, 239],
                "gamutA": [0.3334, 0.3455],
                "gamutB": [0.3334, 0.3455],
                "gamutC": [0.3334, 0.3455],
                "hexColor": "#ffffef"
        }, {
                "name": "Khaki",
                "rgb": [239, 229, 140],
                "gamutA": [0.4019, 0.4261],
                "gamutB": [0.4019, 0.4261],
                "gamutC": [0.4019, 0.4261],
                "hexColor": "#efe58c"
        }, {
                "name": "Lavender",
                "rgb": [229, 229, 249],
                "gamutA": [0.3085, 0.3071],
                "gamutB": [0.3085, 0.3071],
                "gamutC": [0.3085, 0.3071],
                "hexColor": "#e5e5f9"
        }, {
                "name": "Lavender Blush",
                "rgb": [255, 239, 244],
                "gamutA": [0.3369, 0.3225],
                "gamutB": [0.3369, 0.3225],
                "gamutC": [0.3369, 0.3225],
                "hexColor": "#ffeff4"
        }, {
                "name": "Lawn Green",
                "rgb": [124, 252, 0],
                "gamutA": [0.2663, 0.6649],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.2485, 0.641],
                "hexColor": "#7cfc00"
        }, {
                "name": "Lemon Chiffon",
                "rgb": [255, 249, 204],
                "gamutA": [0.3608, 0.3756],
                "gamutB": [0.3608, 0.3756],
                "gamutC": [0.3608, 0.3756],
                "hexColor": "#fff9cc"
        }, {
                "name": "Light Blue",
                "rgb": [173, 216, 229],
                "gamutA": [0.2621, 0.3157],
                "gamutB": [0.2975, 0.2979],
                "gamutC": [0.2621, 0.3157],
                "hexColor": "#add8e5"
        }, {
                "name": "Light Coral",
                "rgb": [239, 127, 127],
                "gamutA": [0.5075, 0.3145],
                "gamutB": [0.5075, 0.3145],
                "gamutC": [0.5075, 0.3145],
                "hexColor": "#ef7f7f"
        }, {
                "name": "Light Cyan",
                "rgb": [224, 255, 255],
                "gamutA": [0.2901, 0.3316],
                "gamutB": [0.3096, 0.3218],
                "gamutC": [0.2901, 0.3316],
                "hexColor": "#e0ffff"
        }, {
                "name": "Light Goldenrod",
                "rgb": [249, 249, 209],
                "gamutA": [0.3504, 0.3717],
                "gamutB": [0.3504, 0.3717],
                "gamutC": [0.3504, 0.3717],
                "hexColor": "#f9f9d1"
        }, {
                "name": "Light Gray",
                "rgb": [211, 211, 211],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#d3d3d3"
        }, {
                "name": "Light Green",
                "rgb": [142, 237, 142],
                "gamutA": [0.2648, 0.4901],
                "gamutB": [0.3682, 0.438],
                "gamutC": [0.2648, 0.4901],
                "hexColor": "#8eed8e"
        }, {
                "name": "Light Pink",
                "rgb": [255, 181, 193],
                "gamutA": [0.4112, 0.3091],
                "gamutB": [0.4112, 0.3091],
                "gamutC": [0.4112, 0.3091],
                "hexColor": "#ffb5c1"
        }, {
                "name": "Light Salmon",
                "rgb": [255, 160, 122],
                "gamutA": [0.5016, 0.3531],
                "gamutB": [0.5016, 0.3531],
                "gamutC": [0.5016, 0.3531],
                "hexColor": "#ffa07a"
        }, {
                "name": "Light Sea Green",
                "rgb": [33, 178, 170],
                "gamutA": [0.1721, 0.358],
                "gamutB": [0.2946, 0.292],
                "gamutC": [0.1611, 0.3593],
                "hexColor": "#21b2aa"
        }, {
                "name": "Light Sky Blue",
                "rgb": [135, 206, 249],
                "gamutA": [0.214, 0.2749],
                "gamutB": [0.2714, 0.246],
                "gamutC": [0.214, 0.2749],
                "hexColor": "#87cef9"
        }, {
                "name": "Light Slate Gray",
                "rgb": [119, 135, 153],
                "gamutA": [0.2738, 0.297],
                "gamutB": [0.2924, 0.2877],
                "gamutC": [0.2738, 0.297],
                "hexColor": "#778799"
        }, {
                "name": "Light Steel Blue",
                "rgb": [175, 196, 221],
                "gamutA": [0.276, 0.2975],
                "gamutB": [0.293, 0.2889],
                "gamutC": [0.276, 0.2975],
                "hexColor": "#afc4dd"
        }, {
                "name": "Light Yellow",
                "rgb": [255, 255, 224],
                "gamutA": [0.3436, 0.3612],
                "gamutB": [0.3436, 0.3612],
                "gamutC": [0.3436, 0.3612],
                "hexColor": "#ffffe0"
        }, {
                "name": "Lime",
                "rgb": [0, 255, 0],
                "gamutA": [0.214, 0.709],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.17, 0.7],
                "hexColor": "#00ff00"
        }, {
                "name": "Lime Green",
                "rgb": [51, 204, 51],
                "gamutA": [0.2101, 0.6765],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.1972, 0.6781],
                "hexColor": "#33cc33"
        }, {
                "name": "Linen",
                "rgb": [249, 239, 229],
                "gamutA": [0.3411, 0.3387],
                "gamutB": [0.3411, 0.3387],
                "gamutC": [0.3411, 0.3387],
                "hexColor": "#f9efe5"
        }, {
                "name": "Magenta",
                "rgb": [255, 0, 255],
                "gamutA": [0.3787, 0.1724],
                "gamutB": [0.3824, 0.1601],
                "gamutC": [0.3833, 0.1591],
                "hexColor": "#ff00ff"
        }, {
                "name": "Maroon",
                "rgb": [175, 48, 96],
                "gamutA": [0.5383, 0.2566],
                "gamutB": [0.5383, 0.2566],
                "gamutC": [0.5383, 0.2566],
                "hexColor": "#af3060"
        }, {
                "name": "Web Maroon",
                "rgb": [127, 0, 0],
                "gamutA": [0.7, 0.2986],
                "gamutB": [0.674, 0.322],
                "gamutC": [0.692, 0.308],
                "hexColor": "#7f0000"
        }, {
                "name": "Medium Aquamarine",
                "rgb": [102, 204, 170],
                "gamutA": [0.215, 0.4014],
                "gamutB": [0.3224, 0.3473],
                "gamutC": [0.215, 0.4014],
                "hexColor": "#66ccaa"
        }, {
                "name": "Medium Blue",
                "rgb": [0, 0, 204],
                "gamutA": [0.139, 0.081],
                "gamutB": [0.168, 0.041],
                "gamutC": [0.153, 0.048],
                "hexColor": "#0000cc"
        }, {
                "name": "Medium Orchid",
                "rgb": [186, 84, 211],
                "gamutA": [0.3365, 0.1735],
                "gamutB": [0.3365, 0.1735],
                "gamutC": [0.3365, 0.1735],
                "hexColor": "#ba54d3"
        }, {
                "name": "Medium Purple",
                "rgb": [147, 112, 219],
                "gamutA": [0.263, 0.1773],
                "gamutB": [0.263, 0.1773],
                "gamutC": [0.263, 0.1773],
                "hexColor": "#9370db"
        }, {
                "name": "Medium Sea Green",
                "rgb": [61, 178, 112],
                "gamutA": [0.1979, 0.5005],
                "gamutB": [0.3588, 0.4194],
                "gamutC": [0.1979, 0.5005],
                "hexColor": "#3db270"
        }, {
                "name": "Medium Slate Blue",
                "rgb": [122, 104, 237],
                "gamutA": [0.2179, 0.1424],
                "gamutB": [0.2189, 0.1419],
                "gamutC": [0.2179, 0.1424],
                "hexColor": "#7a68ed"
        }, {
                "name": "Medium Spring Green",
                "rgb": [0, 249, 153],
                "gamutA": [0.1919, 0.524],
                "gamutB": [0.3622, 0.4262],
                "gamutC": [0.1655, 0.5275],
                "hexColor": "#00f999"
        }, {
                "name": "Medium Turquoise",
                "rgb": [71, 209, 204],
                "gamutA": [0.176, 0.3496],
                "gamutB": [0.2937, 0.2903],
                "gamutC": [0.176, 0.3496],
                "hexColor": "#47d1cc"
        }, {
                "name": "Medium Violet Red",
                "rgb": [198, 20, 132],
                "gamutA": [0.504, 0.2201],
                "gamutB": [0.5002, 0.2255],
                "gamutC": [0.5047, 0.2177],
                "hexColor": "#c61484"
        }, {
                "name": "Midnight Blue",
                "rgb": [25, 25, 112],
                "gamutA": [0.1585, 0.0884],
                "gamutB": [0.1825, 0.0697],
                "gamutC": [0.1616, 0.0802],
                "hexColor": "#191970"
        }, {
                "name": "Mint Cream",
                "rgb": [244, 255, 249],
                "gamutA": [0.315, 0.3363],
                "gamutB": [0.3165, 0.3355],
                "gamutC": [0.315, 0.3363],
                "hexColor": "#f4fff9"
        }, {
                "name": "Misty Rose",
                "rgb": [255, 226, 224],
                "gamutA": [0.3581, 0.3284],
                "gamutB": [0.3581, 0.3284],
                "gamutC": [0.3581, 0.3284],
                "hexColor": "#ffe2e0"
        }, {
                "name": "Moccasin",
                "rgb": [255, 226, 181],
                "gamutA": [0.3927, 0.3732],
                "gamutB": [0.3927, 0.3732],
                "gamutC": [0.3927, 0.3732],
                "hexColor": "#ffe2b5"
        }, {
                "name": "Navajo White",
                "rgb": [255, 221, 173],
                "gamutA": [0.4027, 0.3757],
                "gamutB": [0.4027, 0.3757],
                "gamutC": [0.4027, 0.3757],
                "hexColor": "#ffddad"
        }, {
                "name": "Navy Blue",
                "rgb": [0, 0, 127],
                "gamutA": [0.139, 0.081],
                "gamutB": [0.168, 0.041],
                "gamutC": [0.153, 0.048],
                "hexColor": "#00007f"
        }, {
                "name": "Old Lace",
                "rgb": [252, 244, 229],
                "gamutA": [0.3421, 0.344],
                "gamutB": [0.3421, 0.344],
                "gamutC": [0.3421, 0.344],
                "hexColor": "#fcf4e5"
        }, {
                "name": "Olive",
                "rgb": [127, 127, 0],
                "gamutA": [0.4432, 0.5154],
                "gamutB": [0.4317, 0.4996],
                "gamutC": [0.4334, 0.5022],
                "hexColor": "#7f7f00"
        }, {
                "name": "Olive Drab",
                "rgb": [107, 142, 35],
                "gamutA": [0.354, 0.5561],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.354, 0.5561],
                "hexColor": "#6b8e23"
        }, {
                "name": "Orange",
                "rgb": [255, 165, 0],
                "gamutA": [0.5614, 0.4156],
                "gamutB": [0.5562, 0.4084],
                "gamutC": [0.5569, 0.4095],
                "hexColor": "#ffa500"
        }, {
                "name": "Orange Red",
                "rgb": [255, 68, 0],
                "gamutA": [0.6726, 0.3217],
                "gamutB": [0.6733, 0.3224],
                "gamutC": [0.6731, 0.3222],
                "hexColor": "#ff4400"
        }, {
                "name": "Orchid",
                "rgb": [216, 112, 214],
                "gamutA": [0.3688, 0.2095],
                "gamutB": [0.3688, 0.2095],
                "gamutC": [0.3688, 0.2095],
                "hexColor": "#d870d6"
        }, {
                "name": "Pale Goldenrod",
                "rgb": [237, 232, 170],
                "gamutA": [0.3751, 0.3983],
                "gamutB": [0.3751, 0.3983],
                "gamutC": [0.3751, 0.3983],
                "hexColor": "#ede8aa"
        }, {
                "name": "Pale Green",
                "rgb": [153, 249, 153],
                "gamutA": [0.2675, 0.4826],
                "gamutB": [0.3657, 0.4331],
                "gamutC": [0.2675, 0.4826],
                "hexColor": "#99f999"
        }, {
                "name": "Pale Turquoise",
                "rgb": [175, 237, 237],
                "gamutA": [0.2539, 0.3344],
                "gamutB": [0.3034, 0.3095],
                "gamutC": [0.2539, 0.3344],
                "hexColor": "#afeded"
        }, {
                "name": "Pale Violet Red",
                "rgb": [219, 112, 147],
                "gamutA": [0.4658, 0.2773],
                "gamutB": [0.4658, 0.2773],
                "gamutC": [0.4658, 0.2773],
                "hexColor": "#db7093"
        }, {
                "name": "Papaya Whip",
                "rgb": [255, 239, 214],
                "gamutA": [0.3591, 0.3536],
                "gamutB": [0.3591, 0.3536],
                "gamutC": [0.3591, 0.3536],
                "hexColor": "#ffefd6"
        }, {
                "name": "Peach Puff",
                "rgb": [255, 216, 186],
                "gamutA": [0.3953, 0.3564],
                "gamutB": [0.3953, 0.3564],
                "gamutC": [0.3953, 0.3564],
                "hexColor": "#ffd8ba"
        }, {
                "name": "Peru",
                "rgb": [204, 132, 63],
                "gamutA": [0.5305, 0.3911],
                "gamutB": [0.5305, 0.3911],
                "gamutC": [0.5305, 0.3911],
                "hexColor": "#cc843f"
        }, {
                "name": "Pink",
                "rgb": [255, 191, 204],
                "gamutA": [0.3944, 0.3093],
                "gamutB": [0.3944, 0.3093],
                "gamutC": [0.3944, 0.3093],
                "hexColor": "#ffbfcc"
        }, {
                "name": "Plum",
                "rgb": [221, 160, 221],
                "gamutA": [0.3495, 0.2545],
                "gamutB": [0.3495, 0.2545],
                "gamutC": [0.3495, 0.2545],
                "hexColor": "#dda0dd"
        }, {
                "name": "Powder Blue",
                "rgb": [175, 224, 229],
                "gamutA": [0.262, 0.3269],
                "gamutB": [0.302, 0.3068],
                "gamutC": [0.262, 0.3269],
                "hexColor": "#afe0e5"
        }, {
                "name": "Purple",
                "rgb": [160, 33, 239],
                "gamutA": [0.2651, 0.1291],
                "gamutB": [0.2725, 0.1096],
                "gamutC": [0.2725, 0.1096],
                "hexColor": "#a021ef"
        }, {
                "name": "Web Purple",
                "rgb": [127, 0, 127],
                "gamutA": [0.3787, 0.1724],
                "gamutB": [0.3824, 0.1601],
                "gamutC": [0.3833, 0.1591],
                "hexColor": "#7f007f"
        }, {
                "name": "Rebecca Purple",
                "rgb": [102, 51, 153],
                "gamutA": [0.2703, 0.1398],
                "gamutB": [0.2703, 0.1398],
                "gamutC": [0.2703, 0.1398],
                "hexColor": "#663399"
        }, {
                "name": "Red",
                "rgb": [255, 0, 0],
                "gamutA": [0.7, 0.2986],
                "gamutB": [0.674, 0.322],
                "gamutC": [0.692, 0.308],
                "hexColor": "#ff0000"
        }, {
                "name": "Rosy Brown",
                "rgb": [188, 142, 142],
                "gamutA": [0.4026, 0.3227],
                "gamutB": [0.4026, 0.3227],
                "gamutC": [0.4026, 0.3227],
                "hexColor": "#bc8e8e"
        }, {
                "name": "Royal Blue",
                "rgb": [63, 104, 224],
                "gamutA": [0.1649, 0.1338],
                "gamutB": [0.2047, 0.1138],
                "gamutC": [0.1649, 0.1338],
                "hexColor": "#3f68e0"
        }, {
                "name": "Saddle Brown",
                "rgb": [140, 68, 17],
                "gamutA": [0.5993, 0.369],
                "gamutB": [0.5993, 0.369],
                "gamutC": [0.5993, 0.369],
                "hexColor": "#8c4411"
        }, {
                "name": "Salmon",
                "rgb": [249, 127, 114],
                "gamutA": [0.5346, 0.3247],
                "gamutB": [0.5346, 0.3247],
                "gamutC": [0.5346, 0.3247],
                "hexColor": "#f97f72"
        }, {
                "name": "Sandy Brown",
                "rgb": [244, 163, 96],
                "gamutA": [0.5104, 0.3826],
                "gamutB": [0.5104, 0.3826],
                "gamutC": [0.5104, 0.3826],
                "hexColor": "#f4a360"
        }, {
                "name": "Sea Green",
                "rgb": [45, 140, 86],
                "gamutA": [0.1968, 0.5047],
                "gamutB": [0.3602, 0.4223],
                "gamutC": [0.1968, 0.5047],
                "hexColor": "#2d8c56"
        }, {
                "name": "Seashell",
                "rgb": [255, 244, 237],
                "gamutA": [0.3397, 0.3353],
                "gamutB": [0.3397, 0.3353],
                "gamutC": [0.3397, 0.3353],
                "hexColor": "#fff4ed"
        }, {
                "name": "Sienna",
                "rgb": [160, 81, 45],
                "gamutA": [0.5714, 0.3559],
                "gamutB": [0.5714, 0.3559],
                "gamutC": [0.5714, 0.3559],
                "hexColor": "#a0512d"
        }, {
                "name": "Silver",
                "rgb": [191, 191, 191],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#bfbfbf"
        }, {
                "name": "Sky Blue",
                "rgb": [135, 206, 234],
                "gamutA": [0.2206, 0.2948],
                "gamutB": [0.2807, 0.2645],
                "gamutC": [0.2206, 0.2948],
                "hexColor": "#87ceea"
        }, {
                "name": "Slate Blue",
                "rgb": [107, 89, 204],
                "gamutA": [0.2218, 0.1444],
                "gamutB": [0.2218, 0.1444],
                "gamutC": [0.2218, 0.1444],
                "hexColor": "#6b59cc"
        }, {
                "name": "Slate Gray",
                "rgb": [112, 127, 142],
                "gamutA": [0.2762, 0.3009],
                "gamutB": [0.2944, 0.2918],
                "gamutC": [0.2762, 0.3009],
                "hexColor": "#707f8e"
        }, {
                "name": "Snow",
                "rgb": [255, 249, 249],
                "gamutA": [0.3292, 0.3285],
                "gamutB": [0.3292, 0.3285],
                "gamutC": [0.3292, 0.3285],
                "hexColor": "#fff9f9"
        }, {
                "name": "Spring Green",
                "rgb": [0, 255, 127],
                "gamutA": [0.1994, 0.5864],
                "gamutB": [0.3882, 0.4777],
                "gamutC": [0.1671, 0.5906],
                "hexColor": "#00ff7f"
        }, {
                "name": "Steel Blue",
                "rgb": [68, 130, 181],
                "gamutA": [0.183, 0.2325],
                "gamutB": [0.248, 0.1997],
                "gamutC": [0.183, 0.2325],
                "hexColor": "#4482b5"
        }, {
                "name": "Tan",
                "rgb": [209, 181, 140],
                "gamutA": [0.4035, 0.3772],
                "gamutB": [0.4035, 0.3772],
                "gamutC": [0.4035, 0.3772],
                "hexColor": "#d1b58c"
        }, {
                "name": "Teal",
                "rgb": [0, 127, 127],
                "gamutA": [0.17, 0.3403],
                "gamutB": [0.2858, 0.2747],
                "gamutC": [0.1607, 0.3423],
                "hexColor": "#007f7f"
        }, {
                "name": "Thistle",
                "rgb": [216, 191, 216],
                "gamutA": [0.3342, 0.2971],
                "gamutB": [0.3342, 0.2971],
                "gamutC": [0.3342, 0.2971],
                "hexColor": "#d8bfd8"
        }, {
                "name": "Tomato",
                "rgb": [255, 99, 71],
                "gamutA": [0.6112, 0.3261],
                "gamutB": [0.6112, 0.3261],
                "gamutC": [0.6112, 0.3261],
                "hexColor": "#ff6347"
        }, {
                "name": "Turquoise",
                "rgb": [63, 224, 209],
                "gamutA": [0.1732, 0.3672],
                "gamutB": [0.2997, 0.3022],
                "gamutC": [0.1702, 0.3675],
                "hexColor": "#3fe0d1"
        }, {
                "name": "Violet",
                "rgb": [237, 130, 237],
                "gamutA": [0.3644, 0.2133],
                "gamutB": [0.3644, 0.2133],
                "gamutC": [0.3644, 0.2133],
                "hexColor": "#ed82ed"
        }, {
                "name": "Wheat",
                "rgb": [244, 221, 178],
                "gamutA": [0.3852, 0.3737],
                "gamutB": [0.3852, 0.3737],
                "gamutC": [0.3852, 0.3737],
                "hexColor": "#f4ddb2"
        }, {
                "name": "White",
                "rgb": [255, 255, 255],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#ffffff"
        }, {
                "name": "White Smoke",
                "rgb": [244, 244, 244],
                "gamutA": [0.3227, 0.329],
                "gamutB": [0.3227, 0.329],
                "gamutC": [0.3227, 0.329],
                "hexColor": "#f4f4f4"
        }, {
                "name": "Yellow",
                "rgb": [255, 255, 0],
                "gamutA": [0.4432, 0.5154],
                "gamutB": [0.4317, 0.4996],
                "gamutC": [0.4334, 0.5022],
                "hexColor": "#ffff00"
        }, {
                "name": "Yellow Green",
                "rgb": [153, 204, 51],
                "gamutA": [0.3517, 0.5618],
                "gamutB": [0.408, 0.517],
                "gamutC": [0.3517, 0.5618],
                "hexColor": "#99cc33"
        }];
        /**
         * Parses a valid hex color string and returns the Red RGB integer value.
         *
         * @param {String} Hex color string.
         * @return {Number} Red integer value.
         */
        var hexToRed = function (hex) {
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
            };

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function rgbArrayToHex(rgb) {
            return rgbToHex(rgb[0], rgb[1], rgb[2]);
        }

        this.getColors = function () {
            angular.forEach(colors, function (value) {
                //value.hexColor = rgbArrayToHex(value.rgb);
                var rawxy = ColorService.getRawXYPointFromRGB(value.rgb);
                value.isReachableByGamutA = ColorService.checkPointInLampsReach("A", rawxy);
                value.isReachableByGamutB = ColorService.checkPointInLampsReach("B", rawxy);
                value.isReachableByGamutC = ColorService.checkPointInLampsReach("C", rawxy);
            });
            return colors;
        };

        this.getRandomHexColor = function () {
            return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
        };

        //gamut == A || B || C || AB || AC || BC || ABC
        this.getRandomHexColorForGamut = function (gamut) {

        };

        this.getRandomHexColorForGamutA = function () {
            var color;
            var rawxy;
            do {
                color = self.getRandomHexColor();
                var rgb = hexToRGB(color);
                rawxy = ColorService.getRawXYPointFromRGB(rgb);
            } while (!ColorService.checkPointInLampsReach("A", rawxy));

            return color;
        };

        this.getRandomHexColorForGamutB = function () {
            var color;
            var rawxy;
            do {
                color = self.getRandomHexColor();
                var rgb = hexToRGB(color);
                rawxy = ColorService.getRawXYPointFromRGB(rgb);
            } while (!ColorService.checkPointInLampsReach("B", rawxy));

            return color;
        };

        this.getRandomHexColorForGamutC = function () {
            var color;
            var rawxy;
            do {
                color = self.getRandomHexColor();
                var rgb = hexToRGB(color);
                rawxy = ColorService.getRawXYPointFromRGB(rgb);
            } while (!ColorService.checkPointInLampsReach("C", rawxy));

            return color;
        };

        this.getRandomHexColorForGamutABC = function () {
            var color;
            var rawxy;
            do {
                color = self.getRandomHexColor();
                var rgb = hexToRGB(color);
                rawxy = ColorService.getRawXYPointFromRGB(rgb);
            } while (!ColorService.checkPointInLampsReach("B", rawxy) || !ColorService.checkPointInLampsReach("A", rawxy) || !ColorService.checkPointInLampsReach("C", rawxy));

            return color;
        };

        this.isColorReachableByGamut = function (hexColor, gamut) {
            var rgb = hexToRGB(hexColor);
            var rawxy = ColorService.getRawXYPointFromRGB(rgb);
            return ColorService.checkPointInLampsReach(gamut, rawxy);
        };

        return this;
    };

    factory.$inject = ['ColorService'];
    return factory;
});
