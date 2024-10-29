import { authenticate } from "../../_Autenticacao/middlewares/authenticate";
import { IAppRouter } from "../../interfaces/appInterface";
import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import profileController from "../controllers/profileController";
import { IProfileController, IProfileRouter } from "../Interfaces/profileInterfaces";
import authorize from "../middlewares/authorize";

class ProfileRouter implements IProfileRouter{
    private static instance: ProfileRouter
    private profileController: IProfileController
    
    constructor(profileController: IProfileController) {
        this.profileController = profileController;
    }

    public static getInstance(): ProfileRouter {
        if (!ProfileRouter.instance) {
            ProfileRouter.instance = new ProfileRouter(profileController);
        }
        return ProfileRouter.instance;
    }   

    private registerMiddleware(app: IAppRouter): void {
        app.use(authenticate)
    }

    private registerRoutesGet(basePath: string, app: IAppRouter): void {
        this.registerMiddleware(app);

        app.get(`${basePath}/list`, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.findAll(req, res, next);
        })

        app.get(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.findById(req, res, next);
        })
        
        app.get(`${basePath}/:id/grants`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.getGrantsByProfileId(req, res, next);
        })
        
        app.get(`${basePath}/:id/authentications`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.getAuthenticationsByProfileId(req, res, next);
        })

        app.get(`${basePath}/:authId/authentications/list`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.getProfilesByAuthenticationId(req, res, next);
        })
    }

    private registerRoutesPost(basePath: string, app: IAppRouter): void {
        app.post(`${basePath}/create`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.createProfile(req, res, next);
        })
    }

    private registerRoutesPut(basePath: string, app: IAppRouter): void {
        app.put(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.updateProfile(req, res, next);
        })

        app.put(`${basePath}/:id/add-grants`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.addProfileToGrants(req, res, next);
        })

        app.put(`${basePath}/:authId/add-profiles`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.addProfilesToAuthentication(req, res, next);
        })

        app.put(`${basePath}/:id/remove-grants`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.removeProfileFromGrants(req, res, next);
        })

        app.put(`${basePath}/:authId/remove-profiles`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.removeProfilesFromAuthentication(req, res, next);
        })
    }

    private registerRoutesDelete(basePath: string, app: IAppRouter): void {
        app.delete(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.profileController.deleteProfile(req, res, next);
        })
    }

    public registerRoutes(basePath: string, app: IAppRouter): void {
        // this.registerMiddleware(app);
        this.registerRoutesGet(basePath, app);
        this.registerRoutesPost(basePath, app);
        this.registerRoutesPut(basePath, app);
        this.registerRoutesDelete(basePath, app);
    }

}

export default ProfileRouter.getInstance();