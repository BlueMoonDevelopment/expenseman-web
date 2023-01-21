import { Request, Response } from 'express';
import { isLoggedIn } from '../../controllers/auth.controller';

export const title = 'Sign In';
export const pugfile = 'signin.pug';
export const urlpath = '/auth/signin/';

export async function onLoad(req: Request, res: Response): Promise<Map<string, any>> {
    if (await isLoggedIn(req)) {
        res.cookie('errormsg', 'You are already logged in.');
        res.redirect('/error');
    }
    const map = new Map<string, any>();
    const email = req.cookies.googleEmail;

    if (!email) {
        res.redirect('/auth');
    } else {
        res.clearCookie('googleEmail');
        map.set('email', email);
    }

    return map;
}