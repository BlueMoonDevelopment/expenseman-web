import { Request, Response } from 'express';

export const title = 'Success';
export const pugfile = 'success.pug';
export const urlpath = '/success';

export async function onLoad(req: Request, res: Response): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    const msg = req.cookies.successmsg;

    if (!msg) {
        res.redirect('/error');
    } else {
        res.clearCookie('successmsg');
        map.set('msg', msg);
    }

    return map;
}