import chalk from "chalk";

/**
 * @name Music Logging System
 * @description The Logging System
 * @methods error, log, info, debug
 */
export class Logger {
    /**
     * @name error
     * @description Error Logging
     * @param type 
     * @param err 
     */
    public static error({ type, err }: { type: string; err: any; }): void {
        return console.error(chalk.red(`${chalk.red.bold(`[${type}]`)}      Error logged! ${err}`));
    }
    /**
     * @name log
     * @description Normal Logging
     * @param type 
     * @param msg 
     */
    public static log({ type, msg }: { type: string; msg: string; }): void {
        return console.log(chalk.green(`${chalk.green.bold(`[${type}]`)}      ${msg}`));
    }
    /**
     * @name info
     * @description Info Logging
     * @param type 
     * @param msg 
     */
    public static info({ type, msg }: { type: string; msg: string; }): void {
        console.log(chalk.blueBright(`${chalk.blueBright.bold(`[${type}]`)}      ${msg}`));
    }
    /**
     * @name debug
     * @description Debug Logging
     * @param type 
     * @param msg 
     */
    public static debug({ type, msg }: { type: string; msg: string; }): void {
        console.debug(chalk.blueBright(`${chalk.blueBright.bold(`[${type}]`)}      ${msg}`));
    }
}