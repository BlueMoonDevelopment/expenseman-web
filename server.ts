/**
 * Required external modules
 */
import express, { Application } from 'express';
import path from 'path';
import session from 'express-session';
import bodyparser from 'body-parser';
import cookies from 'cookie-parser';
import passport from 'passport';

/**
 * Required internal modules
 */
import { info } from './logmanager';
import { loadRoutes } from './routemanager';
import { setupPassport } from './passportmanager';
import { setupAuthRoutes } from './routes/auth.routes';

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
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookies());
app.use(session({
    secret: session_secret,
    saveUninitialized: true,
    resave: false,
}));

/**
 * Passport Configuration
 */
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


/**
 * Routes Definitions
 */
setupPassport(app);
setupAuthRoutes(app);
loadRoutes(app);

/**
 * Server Activation
 */
app.listen(website_port, () => {
    info(`Listening to requests at 127.0.0.1:${website_port}`);
});