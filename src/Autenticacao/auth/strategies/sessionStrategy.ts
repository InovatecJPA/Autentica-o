import { IAuthentication, IAuthStrategy } from "../../interfaces/interfaces";

export class SessionStrategy implements IAuthStrategy {

    async authenticate(auth: IAuthentication): Promise<string> {
        return `Session started for user ${auth.id}`;
    }

    async verify(sessionId: string): Promise<any> {
        if (!sessionId) {
            throw new Error('Invalid session');
        }
        return { id: sessionId };
    }

}