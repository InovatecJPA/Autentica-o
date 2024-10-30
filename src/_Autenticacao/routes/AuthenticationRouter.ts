import {  IAppRouter } from "../../interfaces/appInterface";
import { IHttpAuthenticatedRequest, IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import { IAuthenticationController, IAuthenticationRouter } from "../Interfaces/authInterfaces";
import AuthenticationController from "../controllers/authenticationController";
import {authenticate} from "../middlewares/authenticate";


/**
 * @inheritdoc
 */
class AuthenticationRouter implements IAuthenticationRouter {
    private static instance: AuthenticationRouter;
    private authenticationController: IAuthenticationController;

    /**
     * Cria uma inst ncia da classe que implementa as rotas
     * de autentica o
     */
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

        app.get(`${basePath}/me`, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findMe(req, res, next);
        })

        app.get(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.findById(req, res, next);
        })
    }

/**
 * Registers POST routes for authentication-related endpoints.
 * 
 * @param basePath - The base path for the authentication routes.
 * @param app - The application router where the routes will be registered.
 * 
 * POST `${basePath}/register` - Registers a new user.
 * POST `${basePath}/login` - Authenticates a user and initiates a session.
 * POST `${basePath}/forgot-password` - Requests a password reset for a user.
 * POST `${basePath}/validate-password` - Validates the current user's password.
 *   Requires authentication.
 */
    private registerRoutesPost(basePath: string, app: IAppRouter): void {
        app.post(`${basePath}/register`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.createAuthentication(req, res, next);
        });
    
        app.post(`${basePath}/login`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.authenticate(req, res, next);
        });
    
        app.post(`${basePath}/forgot-password`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.requestPasswordReset(req, res, next);
        });

        app.post(`${basePath}/validate-password`, authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.validatePassword(req, res, next);
        });
    }

    /**
     * Registers PUT routes for authentication-related endpoints.
     * 
     * @param basePath - The base path for the authentication routes.
     * @param app - The application router where the routes will be registered.
     * 
     * PUT `${basePath}/toggle-status/:id` - Toggles the authentication status of a user.
     * PUT `${basePath}/update-password` - Updates the current user's password.
     *   Requires authentication.
     * PUT `${basePath}/reset-password` - Resets the current user's password.
     *   Requires authentication.
     * PUT `${basePath}/me` - Updates the current user's data.
     *   Requires authentication.
     * PUT `${basePath}/:id` - Updates a user's data.
     */
    private registerRoutesPut(basePath: string, app: IAppRouter): void {
        
        app.put(`${basePath}/toggle-status/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.toggleAuthenticationStatus(req, res, next);
        });

        app.put(`${basePath}/update-password`, authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updatePassword(req, res, next);
        });
        
        app.put(`${basePath}/reset-password`, authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updatePasswordReset(req, res, next);
        });

        app.put(`${basePath}/me`, authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updateMyAuthentication(req, res, next);
        });
        
        app.put(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.updateAuthentication(req, res, next);
        });
    }

    /**
     * Registers DELETE routes for authentication-related endpoints.
     * 
     * @param basePath - The base path for the authentication routes.
     * @param app - The application router where the routes will be registered.
     * 
     * DELETE `${basePath}/:id` - Deletes a user.
     */
    private registerRoutesDelete(basePath: string, app: IAppRouter): void {
        app.delete(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.authenticationController.deleteAuthentication(req, res, next);
        });
    }

    /**
     * Registers all routes for authentication-related endpoints.
     * 
     * @param basePath - The base path for the authentication routes.
     * @param app - The application router where the routes will be registered.
     */
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



