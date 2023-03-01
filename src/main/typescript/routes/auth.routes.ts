import { Application, Request, Response } from 'express';
import { checkIfUserExists, isLoggedIn } from '../controllers/auth.controller';
import axios, { AxiosResponse } from 'axios';
import { api_endpoint_url } from '../config.json';

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
                const response = await axios.post(api_endpoint_url + '/auth/signup', JSON.stringify({
                    email: email,
                    password: pw,
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    validateStatus: function () {
                        return true;
                    },
                });

                handleResponse(response, res, req);
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
                const response = await axios.post(api_endpoint_url + '/auth/signin', JSON.stringify({
                    email: email,
                    password: pw,
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    validateStatus: function () {
                        return true;
                    },
                });
                handleResponse(response, res, req);
            } else {
                res.redirect('/auth');
            }
        });
    });
}

function handleResponse(response: AxiosResponse, res: Response, req: Request) {
    if (response.status != 200) {
        let msg = `Error ${response.status} An unknown error happened.`;
        if (response.data.message) {
            msg = `Error ${response.status}: ${response.data.message}`;
        }
        res.cookie('errormsg', msg);
        res.status(response.status).redirect('/error');
    } else if (response.data.accessToken && response.data.id) {
        req.session.userId = response.data.id;
        req.session.accessToken = response.data.accessToken;
        res.cookie('successmsg', 'You have been signed in.');
        res.status(200).redirect('/success');
    } else {
        res.cookie('errormsg', 'No userId and accessToken have been provided by the server. Please try again.');
        res.status(500).redirect('/error');
    }
}

export function setupAuthRoutes(app: Application) {
    setupPostSignup(app);
    setupPostSignin(app);
    setupGetLogout(app);
}