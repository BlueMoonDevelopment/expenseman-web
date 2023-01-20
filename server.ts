/**
 * Required external modules
 */
import express, { Application } from 'express';
import path from 'path';
import session from 'express-session';
import bodyparser from 'body-parser';

/**
 * Required internal modules
 */
import { info } from './logmanager';
import { loadRoutes } from './routemanager';
import { setupPassport } from './passportmanager';

/**
 * Required configuration sections
 */
import { website_port, session_secret } from './config.json';

/**
 * App Variables
 */
const app: Application = express();

/**
 * App Configuration
 */
app.use(express.json());
app.set('views', path.join(path.join(__dirname, 'views'), 'frontend'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: session_secret,
    saveUninitialized: true,
    resave: false,
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

/**
 * Routes Definitions
 */
setupPassport(app);
loadRoutes(app);

/**
 * Server Activation
 */
app.listen(website_port, () => {
    info(`Listening to requests at 127.0.0.1:${website_port}`);
});