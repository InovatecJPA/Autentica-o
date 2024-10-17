import { IAuthentication, IAuthStrategy } from "../../authInterfaces/authInterfaces";


class PassportStrategy implements IAuthStrategy {
    async authenticate(auth: Partial<IAuthentication>): Promise<string> {
        return `Passport strategy for user ${auth.id}`;
    }
    async verify(tokenOrSessionId: string): Promise<string> {
        return tokenOrSessionId;
    }
}

export default PassportStrategy;