'use strict';

const chalk = require('chalk');

const log = {

  echo(message: string, level = 0, wrapper: any = null, asString = false) {
    let output;
    if (typeof message === 'string') {
      const string = '  '.repeat(level) + message;
      output = wrapper ? wrapper(string) : string;
    } else {
      output = message;
    }

    if (asString) {
      return output;
    }

    console.log(output);
  },

  error(message: string, level = 0, asString = false) {
    return this.echo(message, level, chalk.red, asString);
  },

  success(message: string, level = 0, asString = false) {
    return this.echo(message, level, chalk.green, asString);
  },

  warning(message: string, level = 0, asString = false) {
    return this.echo(message, level, chalk.yellow, asString);
  },

  notice(message: string, level = 0, asString = false) {
    return this.echo(message, level, chalk.blue, asString);
  },

  info(message: string, level = 0, asString = false) {
    return this.echo(message, level, null, asString);
  },

  line(asString = false) {
    return this.echo('', 0, null, asString);
  }
};

export default log;