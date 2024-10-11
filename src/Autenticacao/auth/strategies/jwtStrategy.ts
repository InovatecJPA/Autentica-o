import { IAuthentication, IAuthStrategy } from "../../interfaces/interfaces";
import jwt from 'jsonwebtoken';

class JwtStrategy implements IAuthStrategy {    
    async authenticate(auth: IAuthentication): Promise<string> {
        return jwt.sign({ id: auth.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }

    async verify(token: string): Promise<any> {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error('Invalid token');
        }
    }
}

export default JwtStrategy