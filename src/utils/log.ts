import colorize, { COLORS } from "./colorize";

const log = {
  echo(message: string, level = 0, color: COLORS | null = null, asString = false) {
    let output;
    if (typeof message === 'string') {
      const string = '  '.repeat(level) + message;
      output = color ? colorize(string, color) : string;
    } else {
      output = message;
    }

    if (asString) {
      return output;
    }

    console.log(output);
  },

  error(message: string, level = 0, asString = false) {
    return log.echo(message, level, COLORS.red, asString);
  },

  success(message: string, level = 0, asString = false) {
    return log.echo(message, level, COLORS.green, asString);
  },

  warning(message: string, level = 0, asString = false) {
    return log.echo(message, level, COLORS.yellow, asString);
  },

  notice(message: string, level = 0, asString = false) {
    return log.echo(message, level, COLORS.blue, asString);
  },

  info(message: string, level = 0, asString = false) {
    return log.echo(message, level, null, asString);
  },

  line(asString = false) {
    return log.echo('', 0, null, asString);
  }
};

export default log;