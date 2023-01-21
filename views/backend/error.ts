import { Request, Response } from 'express';

export const title = 'Error';
export const pugfile = 'error.pug';
export const urlpath = '/error';

export async function onLoad(req: Request, res: Response): Promise<Map<string, any>> {
    const map = new Map<string, any>();
    const msg = req.cookies.errormsg;

    if (!msg) {
        map.set('msg', 'An unknown error occured.');
    } else {
        res.clearCookie('errormsg');
        map.set('msg', msg);
    }

    return map;
}