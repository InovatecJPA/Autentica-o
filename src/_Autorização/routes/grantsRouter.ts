import { authenticate } from "passport";
import { IAppRouter } from "../../interfaces/appInterface";
import grantsController from "../controllers/grantsController";
import { IGrants, IGrantsController, IGrantsRouter } from "../Interfaces/grantsInterfaces";
import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";

class GrantsRouter implements IGrantsRouter{
    private grantsController: IGrantsController;
    private static instance: IGrantsRouter;

    private constructor(grantsController: IGrantsController) {
        this.grantsController = grantsController;
    }

    public static getInstance(): IGrantsRouter {
        if(!GrantsRouter.instance){
            GrantsRouter.instance = new GrantsRouter(grantsController);
        }
        return GrantsRouter.instance;
    }

    private registerMiddleware(app: IAppRouter): void {
        app.use(authenticate)
    }

    private registerRoutesGet(basePath: string, app: IAppRouter): void {
        app.get(`${basePath}/list`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.findAll(req, res, next);
        })

        app.get(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.findById(req, res, next);
        })

        app.get(`${basePath}/:id/profiles`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.getProfilesByGrantsId(req, res, next);
        })
    }

    private registerRoutesPost(basePath: string, app: IAppRouter): void {
        app.post(`${basePath}/create`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.createGrants(req, res, next);
        })
    }

    private registerRoutesPut(basePath: string, app: IAppRouter): void {
        app.put(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.updateGrants(req, res, next);
        })
    }

    private registerRoutesDelete(basePath: string, app: IAppRouter): void {
        app.delete(`${basePath}/:id`, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            this.grantsController.deleteGrants(req, res, next);
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

export default GrantsRouter.getInstance()