/**
 * Required external modules
 */
import express, { Application } from 'express';
import path from 'path';
import session from 'express-session';

/**
 * Required internal modules
 */
import { info } from './logmanager';
import { loadRoutes } from './routemanager';

/**
 * Required configuration sections
 */
import { website_port, session_secret } from './config.json';

/**
 * App Variables
 */
const app: Application = express();
const oneDay = 1000 * 60 * 60 * 24;

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
    cookie: { maxAge: oneDay },
    resave: false,
}));

/**
 * Routes Definitions
 */
loadRoutes(app);

/**
 * Server Activation
 */
app.listen(website_port, () => {
    info(`Listening to requests at 127.0.0.1:${website_port}`);
});