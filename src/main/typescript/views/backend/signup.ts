import { Request, Response } from 'express';
import { isLoggedIn } from '../../controllers/auth.controller';

export const title = 'Sign Up';
export const pugfile = 'signup.pug';
export const urlpath = '/auth/signup/';

export async function onLoad(req: Request, res: Response): Promise<Map<string, string>> {
    if (await isLoggedIn(req)) {
        res.cookie('errormsg', 'You are already logged in.');
        res.redirect('/error');
    }
    const map = new Map<string, string>();
    const email = req.cookies.googleEmail;

    if (!email) {
        res.redirect('/auth');
    } else {
        res.clearCookie('googleEmail');
        map.set('email', email);
    }
    return map;
}