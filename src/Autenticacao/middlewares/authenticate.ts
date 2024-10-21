import createAuthStrategy from '../auth/authFactory';
import { IHttpAuthenticatedRequest, IHttpNext, IHttpResponse } from '../../interfaces/httpInterface';
import dotenv from 'dotenv';

dotenv.config();

async function authenticate(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext)  {
    try {
        const authStrategy = createAuthStrategy();
        let authId: string | null = null;

        if (process.env.AUTH_STRATEGY === 'session') {
            console.log(req.session)
            if (req.session && req.session.auth && req.session.auth.id) { 
                authId = req.session.auth!.id!;
            }    
        }

        if (process.env.AUTH_STRATEGY === 'jwt') {
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = await authStrategy.verify(token);
                
                if (typeof decoded === 'object' && 'id' in decoded) {
                    authId = (decoded as { id: string }).id;
                } else {
                    throw new Error('Token inválido ou sem propriedade "id".');
                }
            }
        }

        if (process.env.AUTH_STRATEGY === 'passport') {
            
        }

        if (!authId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        req.auth = { id: authId };
        console.log(req.auth)
        next();
    } catch (error: any) {
        console.log(error)
        res.status(401).json({ message: 'Authentication failed' });
    }
}

export {authenticate}