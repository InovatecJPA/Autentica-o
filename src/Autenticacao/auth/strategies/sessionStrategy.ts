import { IHttpAuthenticatedRequest, IHttpRequest } from "../../../interfaces/httpInterface";
import HttpError from "../../../utils/customErrors/httpError";
import { IAuthentication, IAuthStrategy } from "../../Interfaces/authInterfaces";

class SessionStrategy implements IAuthStrategy {

    async authenticate(auth: Partial<IAuthentication>): Promise<string> {
        return `Session started for user ${auth.id}`;
    }


    async verify(sessionId: string): Promise<object | string> {
        if (!sessionId) {
            throw new Error('Invalid session');
        }
        return { id: sessionId }; 
    }

    async checkAuthentication(req: IHttpAuthenticatedRequest): Promise<object> {
        console.log(req.session.auth)
        if (!req.session || !req.session.auth || !req.session.auth.id 
            || !req.session.auth.profileId) {
                throw new HttpError(401, 'Invalid session');
            }
        return { id: req.session.auth.id, profileId: req.session.auth.profileId };
    }

}

export default SessionStrategy;