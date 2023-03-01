import { Request, Response } from 'express';
import { isLoggedIn } from '../../controllers/auth.controller';
import axios from 'axios';
import { debug } from '../../tools/logmanager';

export const title = 'Sign In';
export const pugfile = 'accounts.pug';
export const urlpath = '/accounts';

export async function onLoad(req: Request, res: Response): Promise<Map<string, string>> {
    if (!await isLoggedIn(req)) {
        res.cookie('errormsg', 'You are not logged in.');
        res.redirect('/error');
        return new Map<string, string>();
    }

    const accessToken = req.session.accessToken;

    const response = await axios.post('https://api.expenseman.app/accounts', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
        },
    });

    debug(response.data);
    const map = new Map<string, string>();
    return map;
}