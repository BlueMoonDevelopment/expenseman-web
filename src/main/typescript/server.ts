/**
 * Required external modules
 */
import express, { Application } from 'express';
import path from 'path';
/**
 * Types
 */
import session from 'express-session';
import bodyparser from 'body-parser';
import cookies from 'cookie-parser';
import passport from 'passport';

/**
 * Required internal modules
 */
import { info } from './tools/logmanager';
import { loadRoutes } from './tools/routemanager';
import { setupPassport } from './tools/passportmanager';
import { setupAuthRoutes } from './routes/auth.routes';

/**
 * Required configuration sections
 */
import { development_login_mode, session_secret, website_port } from './config.json';

/**
 * Session declaration (TS weirdness)
 */
declare module 'express-session' {
    interface Session {
        userId: string;
        accessToken: string;
    }
}

/**
 * App Variables
 */
const app: Application = express();
const oneDay = 1000 * 60 * 60 * 24;
export const rootPath = __dirname;

/**
 * App Configuration
 */
app.use(express.json());
app.set('views', path.join(path.join(__dirname, 'views'), 'frontend'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookies());
app.use(session({
    secret: session_secret,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: oneDay },
}));

/**
 * Passport Configuration
 */
if (!development_login_mode) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        if (obj) {
            cb(null, obj);
        }
    });
    setupPassport(app);
}

/**
 * Routes Definitions
 */
setupAuthRoutes(app);
loadRoutes(app);

/**
 * Server Activation
 */
app.listen(website_port, () => {
    info(`Listening to requests at 127.0.0.1:${website_port}`);
});