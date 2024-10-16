import App from "../../app";
import {  IAppRouter, IFrameworkAdapter } from "../../interfaces/appInterface";
import { IAuthenticationController } from "../authInterfaces/authInterfaces";
import AuthenticationController from "../controllers/authenticationController";
import createFrameworkAdapter from "./adapterFactory";

class AuthenticationRouter {
    private static instance: AuthenticationRouter;
    private authenticationController: IAuthenticationController;
    private adapter: IFrameworkAdapter;

    constructor() {
        this.adapter = createFrameworkAdapter();
        this.authenticationController = AuthenticationController;
    }

    public static getInstance(): AuthenticationRouter {
        if (!AuthenticationRouter.instance) {
            AuthenticationRouter.instance = new AuthenticationRouter();
        }
        return AuthenticationRouter.instance;
    }
    
    public registerRoutes(app: IAppRouter): void {
        app.post('/login', (req: any, res: any, next: any) => {
            const customReq = this.adapter.toHttpRequest(req);
            const customRes = this.adapter.toHttpResponse(res);
            const customNext = this.adapter.toHttpNext(next);

            this.authenticationController.authenticate(customReq, customRes, customNext);
        });

        app.post('/register', (req: any, res: any, next: any) => {
            const customReq = this.adapter.toHttpRequest(req);
            const customRes = this.adapter.toHttpResponse(res);
            const customNext = this.adapter.toHttpNext(next);

            this.authenticationController.createAuthentication(customReq, customRes, customNext);
        });
        return
    }
}

export default AuthenticationRouter.getInstance();