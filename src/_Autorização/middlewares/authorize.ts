import PermissionManager from "../permissionManager/permissionManager.js";
import authenticationService from "../../_Autenticacao/services/authenticationService.js";
import { IHttpAuthenticatedRequest, IHttpNext, IHttpResponse } from "../../interfaces/httpInterface.js";
import HttpError from "../../utils/customErrors/httpError.js";

async function authorize(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
    try {
        const userId = req.session.auth?.id;
        if (!userId) {
            throw new HttpError(401, "Unauthorized");
        }

        const user = await authenticationService.getInstance().findById(userId);
        if (!user || !user.active) {
            throw new HttpError(403, "User not authorized");
        }

        const requestPath = req.path;
        const requestMethod = req.method.toUpperCase();

        const profiles = await authenticationService.getInstance().getProfilesByAuthenticationId(userId);

        // Se for admin, acesso total
        if (profiles.some((profile) => profile.name.toLowerCase() === "admin")) {
            return next();
        }

        const profileNames = profiles.map((profile) => profile.name);

        if (!PermissionManager.getInstance().hasAccess(profileNames, requestMethod, requestPath)) {
            throw new HttpError(403, "Forbidden Access");
        }

        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden Access" });
    }
}

export default authorize;
