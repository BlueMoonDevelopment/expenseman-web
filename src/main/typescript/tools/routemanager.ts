import fs from 'fs';
import path from 'path';
import { Application } from 'express';
import { debug, error, info } from './logmanager';
import { isLoggedIn } from '../controllers/auth.controller';
import { rootPath } from '../server';

/**
 * Dynamically loads backend and frontend files and loads the views.
 * @param app
 */
export function loadRoutes(app: Application) {
    const backendPath = path.join(path.join(rootPath, 'views'), 'backend');
    const backendFiles = fs.readdirSync(backendPath).filter(file => file.endsWith('.ts'));
    const frontendPath = path.join(path.join(rootPath, 'views'), 'frontend');

    info(`Loading backend files from ${backendPath}`);

    /**
     * Looping through all *.js files in backend folder
     */
    for (const file of backendFiles) {
        const filePath = path.join(backendPath, file);
        info(`Loading ${file}`);

        /**
         * Require the found file to import eveything inside the module.exports array
         */
            // eslint-disable-next-line @typescript-eslint/no-var-requires
        const route = require(filePath);

        /**
         * Sanity checks start here
         */

        /**
         * Check if the file has title in module.exports and if it is a string
         */
        if (typeof route.title !== 'string') {
            error('title is not a string or not set! skipping File.');
            continue;
        }

        /**
         * Check if the file has urlpath in module.exports and if it is a string
         */
        if (typeof route.urlpath !== 'string') {
            error('urlpath is not a string or not set! skipping File.');
            continue;
        }

        /**
         * Check if the file has pugfile in module.exports and if it is a string
         */
        if (typeof route.pugfile !== 'string') {
            error('pugfile is not a string or not set! skipping File.');
            continue;
        }

        /**
         * Check if the pugfile actually exists in the frontend directory
         */
        if (!fs.existsSync(path.join(frontendPath, route.pugfile))) {
            error(`The file ${route.pugfile} does not exist! skipping File.`);
            continue;
        }

        /**
         * Dynamically loading options starts here
         */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: any[string] = [];
        options['title'] = route.title;


        app.use(async function (req, res, next) {
            res.locals.loggedin = await isLoggedIn(req);
            next();
        });

        /**
         * Now finally set the routes, this basically can be translated to:
         * if route.urlpath is called, render route.pugfile with given options and execute the function
         */
        app.get(route.urlpath, async (req, res) => {
            /**
             * Check if backend file has an onLoad() function in module.exports
             * onLoad() has to return a Map object containing options.
             * If you have no options to load, return an empty Map.
             */
            if (typeof route.onLoad === 'function') {
                debug('File has declared an onLoad() function! Calling now...');
                const variables: Map<string, string> = await route.onLoad(req, res);
                /**
                 * Check if map is not empty
                 */
                if (variables.size > 0) {
                    /**
                     * Looping through all the entries in the map and putting them into the options Array.
                     */
                    for (const key of variables.keys()) {
                        const value = variables.get(key)?.toString();
                        options[key] = value;
                        debug(`Loaded key: ${key} as value: ${value}`);
                    }
                }
            }

            if (!res.headersSent) {
                res.render(route.pugfile, options, function (err, html) {
                    debug(`Route called: ${route.urlpath} with title: ${options.title}`);
                    if (err) {
                        throw err;
                    }

                    if (typeof route.onCall === 'function') {
                        debug('File has declared an onCall() function! Calling now...');
                        route.onCall();
                    }

                    /**
                     * Finally send the html to the browser.
                     */
                    if (!res.headersSent) {
                        res.send(html);
                    }
                });
            }

        });
    }

    /**
     * External links start here
     */
    app.get('/discord', (req, res) => {
        res.redirect('https://bluemoondev.org/discord');
    });

    // 404 Error, has to be called last (after all other pages)
    app.use(function (req, res) {
        res.status(404).render('404', { title: '404 - ' + req.path, page: req.path });
    });
}