import { IAuthentication, IAuthStrategy } from "../../authInterfaces/authInterfaces";
import jwt from 'jsonwebtoken';

class JwtStrategy implements IAuthStrategy {    
    /**
     * Gera um token JWT para uma autenticao.
     * @param {Partial<IAuthentication>} auth - A autenticao.
     * @returns {Promise<string>} Retorna o token JWT.
     */
    async authenticate(auth: Partial<IAuthentication>): Promise<string> {
        return jwt.sign({ id: auth.id }, process.env.JWT_SECRET || '123', { expiresIn: '1h' });
    }

    async verify(token: string): Promise<object> {
        try {
        /**
         * Verifica se o token JWT  vlido.
         * @param {string} token - O token JWT.
         * @returns {Promise<object>} Retorna o payload do token JWT, caso o token seja vlido.
         * @throws {Error} Caso o token seja inv lido.
         */
            const token_decoded = jwt.verify(token, process.env.JWT_SECRET || "123");
            return (token_decoded as object);
        } catch (err) {
            throw new Error('Invalid token');
        }
    }
}

export default JwtStrategy