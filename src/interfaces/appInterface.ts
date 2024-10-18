import { IHttpAuthenticatedRequest, IHttpNext, IHttpRequest, IHttpResponse } from "./httpInterface"

export interface IApp {
    router: IAppRouter
    use(middleware: any): void
    useRoute(path: string, middleware: any): void
    start(port: number): void
}

export interface IAppRouter{
    use(middleware: any): void
    getRouter(): IAppRouter
    get(path: string, ...handlers: Array<(req:any, res:any, next:any) => void >): void
    post(path: string, ...handlers: Array<(req:any, res:any, next:any) => void >): void
    put(path: string, ...handlers: Array<(req:any, res:any, next:any) => void >): void
    delete(path: string, ...handlers: Array<(req:any, res:any, next:any) => void >): void
}

export interface IAppAdapter {
    toHttpRequest(req: any): IHttpRequest
    toHttpResponse(res: any): IHttpResponse
    toHttpNext(next: any): IHttpNext
}