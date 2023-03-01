import { Request, Response } from 'express';
import { isLoggedIn } from '../../controllers/auth.controller';
import { development_login_mode } from '../../config.json';

export const title = 'Authenticate';
export const pugfile = 'auth.pug';
export const urlpath = '/auth';

export async function onLoad(req: Request, res: Response): Promise<Map<string, string>> {
    if (await isLoggedIn(req)) {
        res.cookie('errormsg', 'You are already logged in.');
        res.redirect('/error');
        return new Map<string, string>();
    }

    const map = new Map<string, string>();
    if (development_login_mode) {
        map.set('redirect', '/auth/signin');
    } else {
        map.set('redirect', '/auth/google');
    }
    
    return map;
}