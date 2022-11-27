"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLORS = exports.OPTIONS = void 0;
var OPTIONS;
(function (OPTIONS) {
    OPTIONS["reset"] = "\u001B[0m";
    OPTIONS["bold"] = "\u001B[1m";
    OPTIONS["underline"] = "\u001B[4m";
    OPTIONS["reverse"] = "\u001B[7m";
})(OPTIONS = exports.OPTIONS || (exports.OPTIONS = {}));
var COLORS;
(function (COLORS) {
    COLORS["black"] = "\u001B[30m";
    COLORS["red"] = "\u001B[31m";
    COLORS["green"] = "\u001B[32m";
    COLORS["yellow"] = "\u001B[33m";
    COLORS["blue"] = "\u001B[34m";
    COLORS["purple"] = "\u001B[35m";
    COLORS["cyan"] = "\u001B[36m";
    COLORS["white"] = "\u001B[37m";
    COLORS["default"] = "\u001B[39m";
    COLORS["bgBlack"] = "\u001B[40m";
    COLORS["bgRed"] = "\u001B[41m";
    COLORS["bgGreen"] = "\u001B[42m";
    COLORS["bgYellow"] = "\u001B[43m";
    COLORS["bgBlue"] = "\u001B[44m";
    COLORS["bgPurple"] = "\u001B[45m";
    COLORS["bgCyan"] = "\u001B[46m";
    COLORS["bgWhite"] = "\u001B[47m";
    COLORS["bgDefault"] = "\u001B[49m";
    COLORS["lightBlack"] = "\u001B[90m";
    COLORS["lightRed"] = "\u001B[91m";
    COLORS["lightGreen"] = "\u001B[92m";
    COLORS["lightYellow"] = "\u001B[93m";
    COLORS["lightBlue"] = "\u001B[94m";
    COLORS["lightPurple"] = "\u001B[95m";
    COLORS["lightCyan"] = "\u001B[96m";
    COLORS["lightWhite"] = "\u001B[97m";
    COLORS["bgLightBlack"] = "\u001B[100m";
    COLORS["bgLightRed"] = "\u001B[101m";
    COLORS["bgLightGreen"] = "\u001B[102m";
    COLORS["bgLightYellow"] = "\u001B[103m";
    COLORS["bgLightBlue"] = "\u001B[104m";
    COLORS["bgLightPurple"] = "\u001B[105m";
    COLORS["bgLightCyan"] = "\u001B[106m";
    COLORS["bgLightWhite"] = "\u001B[107m";
})(COLORS = exports.COLORS || (exports.COLORS = {}));
var colorize = function (message, color, options) {
    if (options === void 0) { options = []; }
    var colorizedMessage = color ? "".concat(color).concat(message).concat(COLORS.default) : message;
    if (options.includes(OPTIONS.bold)) {
        colorizedMessage = "".concat(OPTIONS.bold).concat(colorizedMessage);
    }
    if (options.includes(OPTIONS.underline)) {
        colorizedMessage = "".concat(OPTIONS.underline).concat(colorizedMessage);
    }
    if (options.includes(OPTIONS.reverse)) {
        colorizedMessage = "".concat(OPTIONS.reverse).concat(colorizedMessage);
    }
    if (options.length > 0) {
        colorizedMessage = "".concat(colorizedMessage).concat(OPTIONS.reset);
    }
    return colorizedMessage;
};
exports.default = colorize;
//# sourceMappingURL=colorize.js.map