import { Request, Response } from 'express';
import { isLoggedIn } from '../../controllers/auth.controller';

export const title = 'Authenticate';
export const pugfile = 'auth.pug';
export const urlpath = '/auth';

export async function onLoad(req: Request, res: Response): Promise<Map<string, any>> {
    if (await isLoggedIn(req)) {
        res.status(403).send('Already logged in');
    }
    const map = new Map<string, any>();
    return map;
}