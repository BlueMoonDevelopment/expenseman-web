import { Application } from 'express';
import passport from 'passport';
import googleauth from 'passport-google-oauth';

import { google_oauth_client_id, google_oauth_client_secret } from './config.json';
import { checkIfUserExists } from './controllers/auth.controller';


export function setupPassport(app: Application) {
    let userProfile: googleauth.Profile;

    app.get('/auth/success', (req, res) => {
        if (userProfile && userProfile.emails) {
            const email = userProfile.emails[0].value;
            checkIfUserExists(email).then((exists) => {
                res.cookie('googleEmail', email);
                if (exists) {
                    res.redirect('/auth/signin/');
                } else {
                    res.redirect('/auth/signup/');
                }
            });
        } else {
            res.redirect('/auth');
        }
    });

    const GoogleStrategy = googleauth.OAuth2Strategy;

    passport.use(new GoogleStrategy({
        clientID: google_oauth_client_id,
        clientSecret: google_oauth_client_secret,
        callbackURL: 'https://expenseman.app/auth/google/callback',
    },
        function (accessToken, refreshToken, profile, done) {
            userProfile = profile;
            return done(null, userProfile);
        }
    ));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }),
        function (req, res) {
            // Successful authentication, redirect success.
            if (userProfile.emails) {
                res.redirect('/auth/success');
            } else {
                res.cookie('errormsg', 'Unknown error during google OAuth 2.0 happened.');
                res.redirect('/error');
            }
        }
    );
}

