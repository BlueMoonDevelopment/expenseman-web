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
                const response = await axios.post('https://api.expenseman.app/auth/signup', JSON.stringify({ email: email, password: pw }), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status == 200) {
                    if (response.data.accessToken) {
                        res.cookie('accessToken', response.data.accessToken);
                        res.cookie('userId', response.data.id);
                        res.cookie('successmsg', 'You have been registered and signed in.');
                        res.redirect('/success');
                    }
                } else {
                    res.cookie('errormsg', `Unknown response status: ${response.status}`);
                    res.redirect('/error');
                }
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
                const response = await axios.post('https://api.expenseman.app/auth/signin', JSON.stringify({ email: email, password: pw }), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status == 200) {
                    if (response.data.accessToken) {
                        res.cookie('accessToken', response.data.accessToken);
                        res.cookie('userId', response.data.id);
                        res.cookie('successmsg', 'You have been signed in.');
                        res.redirect('/success');
                        return;
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
}