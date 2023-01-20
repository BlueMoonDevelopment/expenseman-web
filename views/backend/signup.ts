import { Request } from 'express';

export const title = 'Sign Up';
export const pugfile = 'signup.pug';
export const urlpath = '/auth/signup/:email';

export function onLoad(req: Request): Map<string, any> {
    const map = new Map<string, any>();
    map.set('email', req.params.email);
    return map;
}