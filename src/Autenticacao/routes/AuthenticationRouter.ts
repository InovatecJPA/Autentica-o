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
        app.get(`${basePath}/list`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findAll(req, res, next);
        })

        app.get(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findById(req, res, next);
        })
        
        app.post(`${basePath}/register`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.createAuthentication(req, res, next);
        });

        app.post(`${basePath}/login`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.authenticate(req, res, next);
        });

        app.post(`${basePath}/forgot-password`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.requestPasswordChange(req, res, next);
        });

        app.post(`${basePath}/validate-password`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.validatePassword(req, res, next);
        });

        app.put(`${basePath}/update/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updateAuthentication(req, res, next);
        });

        app.put(`${basePath}/update-password`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updatePassword(req, res, next);
        });

        app.put(`${basePath}/toggle-status/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.toogleAuthenticationStatus(req, res, next);
        });

        app.delete(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.deleteAuthentication(req, res, next);
        });
    }
}

export default AuthenticationRouter.getInstance();