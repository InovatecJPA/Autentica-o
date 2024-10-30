import authenticationService from "../../_Autenticacao/services/authenticationService";
import { IHttpAuthenticatedRequest, IHttpNext, IHttpResponse } from "../../interfaces/httpInterface";
import HttpError from "../../utils/customErrors/httpError";
import profileService from "../services/profileService";

/**
 * Verifica se o caminho de permiss o coincide com o caminho da requisi o
 * @param grantPath - Caminho da permiss o no formato '/permissao/:id'
 * @param requestPath - Caminho da requisi o
 * @returns true caso o caminho da permiss o coincida com o caminho da requisi o, false caso contr rio
 * @example
 * isPathMatch('/permissao/:id', '/permissao/1') // true
 * isPathMatch('/permissao/:id', '/permissao/2') // true
 * isPathMatch('/permissao/:id', '/permissao/abc') // false
 * isPathMatch('/permissao/:id', '/permissao') // false
 */
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



/**
 * Verifica se o usu rio autenticado tem permiss o para acessar o recurso
 * @param req - Requisi o HTTP
 * @param res - Resposta HTTP
 * @param next - Fun o de next que permite a continuidade da execu o
 * @throws {HttpError} Caso o usu rio n o tenha permiss o, lan a um erro com status 403
 * @example
 * // Verifica se o usu rio tem permiss o para acessar o recurso
 * router.get('/recurso', authorize, (req, res) => {
 *   res.send('Recurso acessado com sucesso');
 * });
 */
async function authorize(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) {
    try {
        const userId = req.session.auth.id!;

        const user = await authenticationService.findById(userId)

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        if (!user.active) {
            throw new HttpError(403, 'User not activated');
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

