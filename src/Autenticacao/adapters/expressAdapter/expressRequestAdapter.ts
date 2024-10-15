import { IAuthentication } from "../../interfaces/authInterfaces";
import { Request } from "express";
import  { IHttpRequest } from "../../interfaces/httpInterface";

class ExpressRequestAdapter implements IHttpRequest{
    body: any;
    query: any;
    params: any;
    headers: any;
    session?: any;
    auth?: Partial<IAuthentication>;

    constructor(req: Request) {
        this.body = req.body;
        this.query = req.query;
        this.params = req.params;
        this.headers = req.headers;
        this.session = req.session;
    }
}