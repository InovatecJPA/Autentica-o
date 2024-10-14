import { IAuthentication, IAuthStrategy } from "../../interfaces/interfaces";


class PassportStrategy implements IAuthStrategy {
    async authenticate(auth: Partial<IAuthentication>): Promise<string> {
        return `Passport strategy for user ${auth.id}`;
    }
    async verify(tokenOrSessionId: string): Promise<any> {
        return tokenOrSessionId;
    }
}

export default PassportStrategy;