import {  IAppRouter } from "../../interfaces/appInterface";
import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import { IAuthenticationController } from "../authInterfaces/authInterfaces";
import AuthenticationController from "../controllers/authenticationController";
import {authenticate} from "../middlewares/authenticate";

function a (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) {
    console.log("Handler da rota a executado");
}

function b (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) {
    console.log("Handler da rota b executado");
}

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


    private registerMiddleware(app: IAppRouter): void {
        app.use(authenticate)
    }

    private registerRoutesGet(basePath: string, app: IAppRouter): void {
        app.get(`${basePath}/list`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findAll(req, res, next);
        })

        app.get(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findById(req, res, next);
        })
    }

    private registerRoutesPost(basePath: string, app: IAppRouter): void {
        app.post(`${basePath}/register`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.createAuthentication(req, res, next);
        });
    
        app.post(`${basePath}/login`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.authenticate(req, res, next);
        });
    
        app.post(`${basePath}/forgot-password`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.requestPasswordChange(req, res, next);
        });

        app.post(`${basePath}/validate-password`, authenticate, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.validatePassword(req, res, next);
        });
    }

    private registerRoutesPut(basePath: string, app: IAppRouter): void {
        
        app.put(`${basePath}/update-password`, authenticate, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updatePassword(req, res, next);
        });
        
        app.put(`${basePath}/toggle-status/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.toggleAuthenticationStatus(req, res, next);
        });
        
        app.put(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updateAuthentication(req, res, next);
        });
    }

    private registerRoutesDelete(basePath: string, app: IAppRouter): void {
        app.delete(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.deleteAuthentication(req, res, next);
        });
    }

    public registerRoutes(basePath: string, app: IAppRouter): void {
        
        // Para aplicar o middleware em toda a rota
        // this.registerMiddleware(app);

        this.registerRoutesGet(basePath, app);
        
        this.registerRoutesPost(basePath, app);

        this.registerRoutesPut(basePath, app);

        this.registerRoutesDelete(basePath, app);
    }
}

export default AuthenticationRouter.getInstance();



