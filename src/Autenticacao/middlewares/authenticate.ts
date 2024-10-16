import { Request, Response, NextFunction } from 'express';
import createAuthStrategy from '../auth/authFactory';
import { IHttpRequest } from '../../interfaces/httpInterface';
import dotenv from 'dotenv';

dotenv.config();

// async function authenticate(req: IHttpRequest, res: Response, next: NextFunction)  {
//     try {
//         const authStrategy = createAuthStrategy();
//         let authId: string | null = null;

//         if (process.env.AUTH_STRATEGY === 'session') {
//             if (req.session && req.session.auth && req.session.auth.id) { 
//                 authId = req.session.auth!.id!;
//             }    
//         }

//         if (process.env.AUTH_STRATEGY === 'jwt') {
//             if (req.headers.authorization) {
//                 const token = req.headers.authorization.split(' ')[1];
//                 const decoded = await authStrategy.verify(token);
//                 authId = decoded.id;
//             }
//         }

//         if (process.env.AUTH_STRATEGY === 'passport') {
            
//         }

//         if (!authId) {
//             return res.status(401).json({ message: 'User not authenticated' });
//         }

//         req.auth = { id: authId };

//         next();
//     } catch  {
//         res.status(401).json({ message: 'Authentication failed' });
//     }
// }