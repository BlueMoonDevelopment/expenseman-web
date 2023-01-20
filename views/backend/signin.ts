import { Request, Response } from 'express';

export const title = 'Sign In';
export const pugfile = 'signin.pug';
export const urlpath = '/auth/signin/:email';

export function onLoad(req: Request, res: Response): Map<string, any> {
    const map = new Map<string, any>();
    map.set('email', req.params.email);
    return map;
}