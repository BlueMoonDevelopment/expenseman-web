import { Application } from 'express';
import { checkIfUserExists, isLoggedIn } from '../controllers/auth.controller';
import axios from 'axios';

function setupPostSignup(app: Application) {
    app.post('/auth/signup', async (req, res) => {
        if (await isLoggedIn(req)) {
            res.cookie('errormsg', 'You are already logged in.');
            res.redirect('/error');
            return;
        }
        const email = req.body.email;
        const pw = req.body.password;

        checkIfUserExists(email).then(async (exists) => {
            if (exists) {
                res.cookie('errormsg', 'User is already existing.');
                res.redirect('/error');
            } else {
                const response = await axios.post('https://api.expenseman.app/auth/signup', JSON.stringify({
                    email: email,
                    password: pw,
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status == 200) {
                    if (response.data.message) {
                        res.cookie('errormsg', response.data.message);
                        res.redirect('/error');
                    } else if (response.data.accessToken && response.data.id) {
                        req.session.userId = response.data.id;
                        req.session.accessToken = response.data.accessToken;
                        res.cookie('successmsg', 'You have been registered and signed in.');
                        res.redirect('/success');
                    } else {
                        res.cookie('errormsg', 'Unknown error! Please try again.');
                        res.redirect('/error');
                    }
                } else {
                    res.cookie('errormsg', `Unknown response status: ${response.status}`);
                    res.redirect('/error');
                }
            }
        });
    });
}

function setupGetLogout(app: Application) {
    app.get('/auth/signout', (req, res) => {
        if (!isLoggedIn(req)) {
            res.cookie('errormsg', 'You are not logged in.');
            res.redirect('/error');
            return;
        }

        req.session.destroy(err => {
            if (err) {
                res.cookie('errormsg', `You could not be singed out! Error: ${err}`);
                res.redirect('/error');
                return;
            } else {
                res.cookie('successmsg', 'You have been signed out.');
                res.redirect('/success');
                return;
            }
        });
    });

}

function setupPostSignin(app: Application) {
    app.post('/auth/signin', async (req, res) => {
        if (await isLoggedIn(req)) {
            res.cookie('errormsg', 'You are already logged in.');
            res.redirect('/error');
            return;
        }
        const email = req.body.email;
        const pw = req.body.password;

        checkIfUserExists(email).then(async (exists) => {
            if (exists) {
                const response = await axios.post('https://api.expenseman.app/auth/signin', JSON.stringify({
                    email: email,
                    password: pw,
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status == 200) {
                    if (response.data.message) {
                        res.cookie('errormsg', response.data.message);
                        res.redirect('/error');
                    } else if (response.data.accessToken && response.data.id) {
                        req.session.userId = response.data.id;
                        req.session.accessToken = response.data.accessToken;
                        res.cookie('successmsg', 'You have been signed in.');
                        res.redirect('/success');
                        return;
                    } else {
                        res.cookie('errormsg', 'Unknown error! Please try again.');
                        res.redirect('/error');
                    }
                } else {
                    res.cookie('errormsg', `Unknown response status: ${response.status}`);
                    res.redirect('/error');
                }
            } else {
                res.redirect('/auth');
            }
        });
    });
}

export function setupAuthRoutes(app: Application) {
    setupPostSignup(app);
    setupPostSignin(app);
    setupGetLogout(app);
}