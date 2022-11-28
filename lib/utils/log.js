"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colorize_1 = require("./colorize");
var log = {
    echo: function (message, level, color, asString) {
        if (level === void 0) { level = 0; }
        if (color === void 0) { color = null; }
        if (asString === void 0) { asString = false; }
        var output;
        if (typeof message === 'string') {
            var string = '  '.repeat(level) + message;
            output = color ? (0, colorize_1.default)(string, color) : string;
        }
        else {
            output = message;
        }
        if (asString) {
            return output;
        }
        // eslint-disable-next-line no-console
        console.log(output);
    },
    error: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return log.echo(message, level, colorize_1.COLORS.red, asString);
    },
    success: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return log.echo(message, level, colorize_1.COLORS.green, asString);
    },
    warning: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return log.echo(message, level, colorize_1.COLORS.yellow, asString);
    },
    notice: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return log.echo(message, level, colorize_1.COLORS.blue, asString);
    },
    info: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return log.echo(message, level, null, asString);
    },
    line: function (asString) {
        if (asString === void 0) { asString = false; }
        return log.echo('', 0, null, asString);
    },
};
exports.default = log;
//# sourceMappingURL=log.js.map