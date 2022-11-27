export declare enum OPTIONS {
    reset = "\u001B[0m",
    bold = "\u001B[1m",
    underline = "\u001B[4m",
    reverse = "\u001B[7m"
}
export declare enum COLORS {
    black = "\u001B[30m",
    red = "\u001B[31m",
    green = "\u001B[32m",
    yellow = "\u001B[33m",
    blue = "\u001B[34m",
    purple = "\u001B[35m",
    cyan = "\u001B[36m",
    white = "\u001B[37m",
    default = "\u001B[39m",
    bgBlack = "\u001B[40m",
    bgRed = "\u001B[41m",
    bgGreen = "\u001B[42m",
    bgYellow = "\u001B[43m",
    bgBlue = "\u001B[44m",
    bgPurple = "\u001B[45m",
    bgCyan = "\u001B[46m",
    bgWhite = "\u001B[47m",
    bgDefault = "\u001B[49m",
    lightBlack = "\u001B[90m",
    lightRed = "\u001B[91m",
    lightGreen = "\u001B[92m",
    lightYellow = "\u001B[93m",
    lightBlue = "\u001B[94m",
    lightPurple = "\u001B[95m",
    lightCyan = "\u001B[96m",
    lightWhite = "\u001B[97m",
    bgLightBlack = "\u001B[100m",
    bgLightRed = "\u001B[101m",
    bgLightGreen = "\u001B[102m",
    bgLightYellow = "\u001B[103m",
    bgLightBlue = "\u001B[104m",
    bgLightPurple = "\u001B[105m",
    bgLightCyan = "\u001B[106m",
    bgLightWhite = "\u001B[107m"
}
declare const colorize: (message: string, color: COLORS | null, options?: OPTIONS[]) => string;
export default colorize;
