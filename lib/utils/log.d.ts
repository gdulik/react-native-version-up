import { COLORS } from "./colorize";
declare const log: {
    echo(message: string, level?: number, color?: COLORS | null, asString?: boolean): string;
    error(message: string, level?: number, asString?: boolean): string;
    success(message: string, level?: number, asString?: boolean): string;
    warning(message: string, level?: number, asString?: boolean): string;
    notice(message: string, level?: number, asString?: boolean): string;
    info(message: string, level?: number, asString?: boolean): string;
    line(asString?: boolean): string;
};
export default log;
