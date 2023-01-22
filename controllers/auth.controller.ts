import axios from 'axios';
import { Request } from 'express';

export async function checkIfUserExists(emailVal: string): Promise<boolean> {
    const res = await axios.post('https://api.expenseman.app/auth/checkuser', JSON.stringify({ email: emailVal }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.data.exists;
}

export async function isLoggedIn(req: Request): Promise<boolean> {
    if (req.session.userId && req.session.accessToken) {
        const userId = req.session.userId;
        const accessToken = req.session.accessToken;
        const response = await axios.post('https://api.expenseman.app/auth/checktoken', JSON.stringify({
            id: userId,
            accessToken: accessToken,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data.matching) {
            return true;
        } else {
            // Delete existing session
            req.session.destroy((err) => {
                if (err) console.log(err);
            });
            return false;
        }
    } else {
        return false;
    }
}