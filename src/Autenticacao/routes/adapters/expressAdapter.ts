import { NextFunction, Request, Response } from "express";
import  { IHttpNext, IHttpRequest, IHttpResponse } from "../../../interfaces/httpInterface";
import { IFrameworkAdapter } from "../../../interfaces/appInterface";

class ExpressAdapter  {
    static toHttpRequest(req: Request): IHttpRequest {
        return{
            body: req.body,
            query: req.query,
            params: req.params,
            headers: req.headers,
            session: req.session || undefined,
        }
    }

    static toHttpResponse(res: Response): IHttpResponse {
        return {
            status: (code: number) => res.status(code),
            json: (data: any) => res.json(data),
            send: (data: any) => res.send(data),
        }
    }

    static toHttpNext(next: NextFunction): IHttpNext {
        return (error?: any) => next(error);
    }
}

export default ExpressAdapter