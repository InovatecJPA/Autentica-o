import { IAuthentication, IAuthStrategy } from "../../interfaces/interfaces";

class SessionStrategy implements IAuthStrategy {

    async authenticate(auth: Partial<IAuthentication>): Promise<string> {
        return `Session started for user ${auth.id}`;
    }

    async verify(sessionId: string): Promise<any> {
        if (!sessionId) {
            throw new Error('Invalid session');
        }
        return { id: sessionId };
    }

}

export default SessionStrategy;