import { Application } from 'express';
import { checkIfUserExists, isLoggedIn } from '../controllers/auth.controller';
import axios from 'axios';

function setupPostSignup(app: Application) {
    app.post('/auth/signup', async (req, res) => {
        if (await isLoggedIn(req)) {
            res.status(200).send('You are already logged in');
            return;
        }
        const email = req.body.email;
        const pw = req.body.password;

        checkIfUserExists(email).then(async (exists) => {
            console.log('debug' + exists);
            if (exists) {
                res.status(401).send('User is already existing.');
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
                        res.status(200).send('You have been registered and signed in.');
                    }
                } else if (response.status == 500) {
                    console.log('error');
                } else {
                    res.status(200).send('error, unknown response status');
                }
            }
        });
    });
}

function setupPostSignin(app: Application) {
    app.post('/auth/signin', async (req, res) => {
        if (await isLoggedIn(req)) {
            res.status(200).send('You are already logged in');
            return;
        }
        const email = req.body.email;
        const pw = req.body.password;

        checkIfUserExists(email).then(async (exists) => {
            console.log('debug' + exists);
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
                        res.status(200).send('You have been signed in.');
                    }
                } else if (response.status == 500) {
                    console.log('error');
                } else {
                    res.status(200).send('error, unknown response status');
                }

            } else {
                res.redirect(`/auth/signup/${email}`);
            }
        });
    });
}

export function setupAuthRoutes(app: Application) {
    setupPostSignup(app);
    setupPostSignin(app);
}