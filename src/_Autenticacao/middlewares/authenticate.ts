import createAuthStrategy from '../auth/authFactory';
import { IHttpAuthenticatedRequest, IHttpNext, IHttpResponse } from '../../interfaces/httpInterface';
import dotenv from 'dotenv';

dotenv.config();

async function authenticate(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext)  {
    try {
        const authStrategy = createAuthStrategy();

        const authId = await authStrategy.checkAuthentication(req)
                
        if (!authId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        req.session = { auth: authId };

        next();
    } catch (error: any) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}

export {authenticate}