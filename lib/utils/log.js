'use strict';
var chalk = require('chalk');
module.exports = {
    echo: function (message, level, wrapper, asString) {
        if (level === void 0) { level = 0; }
        if (wrapper === void 0) { wrapper = null; }
        if (asString === void 0) { asString = false; }
        var output;
        if (typeof message === 'string') {
            var string = '  '.repeat(level) + message;
            output = wrapper ? wrapper(string) : string;
        }
        else {
            output = message;
        }
        if (asString) {
            return output;
        }
        console.log(output);
    },
    error: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return this.echo(message, level, chalk.red, asString);
    },
    success: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return this.echo(message, level, chalk.green, asString);
    },
    warning: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return this.echo(message, level, chalk.yellow, asString);
    },
    notice: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return this.echo(message, level, chalk.blue, asString);
    },
    info: function (message, level, asString) {
        if (level === void 0) { level = 0; }
        if (asString === void 0) { asString = false; }
        return this.echo(message, level, null, asString);
    },
    line: function (asString) {
        if (asString === void 0) { asString = false; }
        return this.echo('', 0, null, asString);
    }
};
//# sourceMappingURL=log.js.map