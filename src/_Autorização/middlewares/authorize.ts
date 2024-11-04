import { match } from 'path-to-regexp';
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

        if (!userId) {
            throw new HttpError(401, 'Unauthorized');
        }

        const user = await authenticationService.findById(userId)

        if (!user || !user.active) {
            throw new HttpError(403, 'User not authorized');
        }
        
        const requestPath = req.path;
        const requestMethod = req.method.toUpperCase();

        const profiles = await authenticationService.getProfilesByAuthenticationId(userId);

        if (profiles.some(profile => profile.name.toLowerCase() === 'admin')) {
            return next();
        }

        const profileIds = profiles.map(profile => profile.id);
        const grants = await profileService.getGrantsByProfilesId(profileIds);

        const hasAccess = grants.some(grant => {
            const grantMethod = grant.method.toUpperCase();

            if (grantMethod !== requestMethod) {
                return false;
            }

            const isMatch = match(grant.path, { decode: decodeURIComponent });
            const matched = isMatch(requestPath);
            return matched !== false;
        });

        if (!hasAccess) {
            throw new HttpError(403, 'Forbidden Access');
        }

        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden Access' });   
    }

}

export default authorize

