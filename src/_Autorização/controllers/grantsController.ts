import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import HttpError from "../../utils/customErrors/httpError";
import { IGrants, IGrantsController, IGrantsParams, IGrantsService } from "../Interfaces/grantsInterfaces";
import grantsService from "../services/grantsService";

class GrantsController implements IGrantsController {
    private grantsService: IGrantsService;
    private static instance: IGrantsController;

    private constructor(grantsService: IGrantsService) {
        this.grantsService = grantsService;
    }

    public static getInstance(): IGrantsController {
        if(!GrantsController.instance){
            GrantsController.instance = new GrantsController(grantsService);
        }
        return GrantsController.instance;
    }


    async findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const grants = await this.grantsService.findAll();

            if(grants.length < 1){
                throw new Error("Grants not found");
            }

            res.status(200).send(grants);
        }catch (error: any) {
            next(error);
        }
    }
    async findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            
            const grant = await this.grantsService.findById(id);
            if(!grant){
                throw new Error("Grant not found");
            }

            res.status(200).send(grant);
        } catch (error: any) {
            next(error);
        }
    }

    async createGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const {method, path, description} = req.body

            if(!method || !path){
                throw new HttpError(409, "Method and path are required");
            }

            const grant: IGrantsParams = {
                method,
                path,
                description
            }

            await this.grantsService.createGrants(grant);

            res.status(201).send("Grant created");
        } catch (error: any) {
            next(error);
        }
    }

    async updateGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { id } = req.params;
            const {method, path, description} = req.body
            
            if(!method && !path && !description){
                throw new HttpError(400, "No valid fields provided for update");
            }
            
            if(!id){
                throw new HttpError(400, "Id is required");
            }
        
            const grant: IGrantsParams = {
                method,
                path,
                description
            }
        
            await this.grantsService.updateGrants(id, grant);
        
            res.status(200).send("Grant updated");
        } catch(error: any){
            next(error)
        }
    }

    async deleteGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            if(!id){
                throw new HttpError(400, "Id is required");
            }
            await this.grantsService.deleteGrants(id);
            res.status(200).send("Grant deleted");
        } catch (error: any) {
            next(error);
        }
    }

    async getProfilesByGrantsId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            if(!id){
                throw new HttpError(400, "Id is required");
            }
            const grants = await this.grantsService.getProfilesByGrantsId(id);
            res.status(200).send(grants);
        } catch (error: any) {
            next(error);
        }
    }
}

export default GrantsController.getInstance();