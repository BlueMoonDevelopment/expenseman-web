import axios from 'axios';
import { Request } from 'express';

export async function isLoggedIn(req: Request): Promise<boolean> {


    const response = await axios.post('https://api.expenseman.app/auth/checktoken', JSON.stringify({ id: req.cookies.userId, accessToken: req.cookies.accessToken }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.data.matching;
}