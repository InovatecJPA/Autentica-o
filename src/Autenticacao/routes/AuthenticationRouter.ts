import {  IAppRouter } from "../../interfaces/appInterface";
import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import { IAuthenticationController } from "../authInterfaces/authInterfaces";
import AuthenticationController from "../controllers/authenticationController";

class AuthenticationRouter {
    private static instance: AuthenticationRouter;
    private authenticationController: IAuthenticationController;

    constructor() {
        this.authenticationController = AuthenticationController;
    }

    public static getInstance(): AuthenticationRouter {
        if (!AuthenticationRouter.instance) {
            AuthenticationRouter.instance = new AuthenticationRouter();
        }
        return AuthenticationRouter.instance;
    }

    public registerRoutes(basePath: string, app: IAppRouter): void {
        app.post(`${basePath}/login`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.authenticate(req, res, next);

        });

        app.post(`${basePath}/register`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.createAuthentication(req, res, next);
        });
    }
}

export default AuthenticationRouter.getInstance();