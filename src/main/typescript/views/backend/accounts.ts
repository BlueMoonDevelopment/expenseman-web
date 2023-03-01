import { Request, Response } from 'express';
import { isLoggedIn } from '../../controllers/auth.controller';
import axios from 'axios';

export const title = 'List of accounts';
export const pugfile = 'accounts.pug';
export const urlpath = '/accounts';

export async function onLoad(req: Request, res: Response): Promise<Map<string, string>> {
    if (!await isLoggedIn(req)) {
        res.cookie('errormsg', 'You are not logged in.');
        res.redirect('/error');
        return new Map<string, string>();
    }

    const accessToken = req.session.accessToken;

    const response = await axios.get('https://api.expenseman.app/accounts', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
        },
        validateStatus: function () {
            return true;
        },
    });

    const map = new Map<string, string>();

    if (response.status != 200) {
        let msg = `Error ${response.status} An unknown error happened.`;
        if (response.data.message) {
            msg = `Error ${response.status}: ${response.data.message}`;
        }
        res.cookie('errormsg', msg);
        res.status(response.status).redirect('/error');
        return new Map<string, string>();
    } else {
        // Status 200
        if (response.data.length == 0) {
            const msg = 'No accounts have been found for your user.';
            res.cookie('successmsg', msg);
            res.redirect('/success');
            return new Map<string, string>();
        }

        for (const account of response.data) {
            console.log(`ID: ${account._id}`);
            console.log(`Content: ${account}`);
        }

        map.set(response.data[0]._id, response.data[0].toString());
    }
    return map;
}