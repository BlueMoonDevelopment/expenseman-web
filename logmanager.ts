import { debug_log } from './config.json';

/**
* If debug_log is enabled in config.json file, print out debug message to console
* @param {string} msg The message to log
*/
export function debug(msg: string): void {
    if (debug_log) {
        console.log(`[DEBUG] ${msg}`);
    }
}

/**
 * Print out info message to console
 * @param {string} msg The message to log
 */
export function info(msg: string): void {
    console.log(`[INFO] ${msg}`);
}

/**
 * Print out error message to console
 * @param {string} msg The error message to log
 */
export function error(msg: string): void {
    console.log(`[ERROR] ${msg}`);
}

