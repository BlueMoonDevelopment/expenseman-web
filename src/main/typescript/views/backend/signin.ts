import { Request, Response } from 'express';
import { isLoggedIn } from '../../controllers/auth.controller';
import { development_login_mode } from '../../config.json';

export const title = 'Sign In';
export const pugfile = 'signin.pug';
export const urlpath = '/auth/signin/';

export async function onLoad(req: Request, res: Response): Promise<Map<string, string>> {
    if (await isLoggedIn(req)) {
        res.cookie('errormsg', 'You are already logged in.');
        res.redirect('/error');
        return new Map<string, string>();
    }
    const map = new Map<string, string>();

    if (!development_login_mode) {
        const email = req.cookies.googleEmail;

        if (!email) {
            res.redirect('/auth');
        } else {
            res.clearCookie('googleEmail');
            map.set('email', email);
        }
    }
    return map;
}