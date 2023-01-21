import axios from 'axios';
import { Request } from 'express';

export async function checkIfUserExists(emailVal: string): Promise<boolean> {
    const res = await axios.post('https://api.expenseman.app/auth/checkuser', JSON.stringify({ email: emailVal }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res.status == 200) {
        const exists: boolean = res.data.exists;
        return exists;
    } else {
        return false;
    }
}

export function isLoggedIn(req: Request): boolean {
    if (req.session.userId && req.session.accessToken) {
        return true;
    } else {
        return false;
    }
}