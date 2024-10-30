import authenticationService from "../../_Autenticacao/services/authenticationService";
import { IHttpAuthenticatedRequest, IHttpNext, IHttpResponse } from "../../interfaces/httpInterface";
import HttpError from "../../utils/customErrors/httpError";
import profileService from "../services/profileService";

function isPathMatch(grantPath: string, requestPath: string): boolean {
    const grantSegments = grantPath.split('/');
    const requestSegments = requestPath.split('/');

    if (grantSegments.length !== requestSegments.length) {
        return false
    }

    return grantSegments.every((segment, index) => {
        return segment.startsWith(':') || segment === requestSegments[index];
    });
}


async function authorize(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) {
    try {
        const userId = req.session.auth.id!;

        const user = await authenticationService.findById(userId)

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.active) {
            throw new Error('User not activated');
        }
        
        const path = req.path;
        const method = req.method;

        const profiles = await profileService.getProfilesByAuthenticationId(userId);

        if (profiles.length > 0 && profiles.some(profile => profile.name === 'Admin')){
            return next();
        }

        const grantPromises = profiles.map(async (profile) => {

            if (profile.name === 'Admin') {
                return true;
            }

            const grants = await profileService.getGrantsByProfileId(profile.id);
            return grants.some(grant => {
                return isPathMatch(grant.path, path) && grant.method === method;
            });
        });
        
        const accessGranted = (await Promise.all(grantPromises)).some(granted => granted);

        if (!accessGranted) {
            throw new HttpError(403, 'Forbidden Access');
        }

        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden Access' });   
    }

}

export default authorize

