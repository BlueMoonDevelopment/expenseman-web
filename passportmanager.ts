import { Application } from 'express';
import passport from 'passport';
import googleauth from 'passport-google-oauth';
import axios from 'axios';

import { google_oauth_client_id, google_oauth_client_secret } from './config.json';


export function setupPassport(app: Application) {
    let userProfile: googleauth.Profile;
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/success', (req, res) => {
        if (userProfile && userProfile.emails) {
            const email = userProfile.emails[0].value;
            console.log(email);
            checkIfUserExists(email).then((exists) => {
                if (exists) {
                    res.redirect('/auth/signin');
                } else {
                    res.redirect('/auth/signup');
                }
            });
        } else {
            res.redirect('/auth/error');
        }

    });
    app.get('/auth/error', (req, res) => res.status(500).send('error logging in'));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        if (obj) {
            cb(null, obj);
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
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/error' }),
        function (req, res) {
            // Successful authentication, redirect success.
            if (userProfile.emails) {
                res.redirect('/auth/success');
            } else {
                res.redirect('/auth/error');
            }
        }
    );
}

async function checkIfUserExists(emailVal: string): Promise<boolean> {
    const res = await axios.post('https://api.expenseman.app/auth/checkuser', JSON.stringify({ email: emailVal }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(res);
    if (res.status == 200) {
        const exists: boolean = res.data.exists;
        return exists;
    } else {
        return false;
    }
}