import { Request, Response } from 'express';

export const title = 'Success';
export const pugfile = 'success.pug';
export const urlpath = '/success';

export async function onLoad(req: Request, res: Response): Promise<Map<string, any>> {
    const map = new Map<string, any>();
    const msg = req.cookies.errormsg;

    if (!msg) {
        res.redirect('/error');
    } else {
        res.clearCookie('successmsg');
        map.set('msg', msg);
    }

    return map;
}