import { IAppRouter } from "../../interfaces/appInterface"
import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface"
import { IProfile } from "./profileInterfaces"

export interface IGrants{
    id: string
    method: string
    path: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    grants_profiles?: IProfile[]
}

export interface IGrantsParams{
    method: string
    path: string
    description: string | null
}

export interface IGrantsRepository{
    findAll(): Promise<IGrants[]>
    findById(id: string): Promise<IGrants | null> 
    findByMethodAndPath(method: string, path: string): Promise<IGrants | null>
    findByIds(ids: string[]): Promise<IGrants[]>
    createGrants(grantsData: IGrantsParams): Promise<IGrants | null>
    updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants | null>
    deleteGrants(id: string): Promise<void>

    getProfilesByGrantsId(grants: IGrants): Promise<IProfile[]>
}

export interface IGrantsService{
    findAll(): Promise<IGrants[]>
    findByIds(ids: string[]): Promise<IGrants[]>
    findById(id: string): Promise<IGrants | null> 
    createGrants(grantsData: IGrantsParams): Promise<void>
    updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<void>
    deleteGrants(id: string): Promise<void>

    getProfilesByGrantsId(grantId: string): Promise<IProfile[]>
}

export interface IGrantsController{
    findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>; 
    createGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    updateGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    deleteGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>

    getProfilesByGrantsId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
}

export interface IGrantsRouter{
    registerRoutes(basePath: string, app: IAppRouter): void
}