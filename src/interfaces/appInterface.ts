import { IHttpNext, IHttpRequest, IHttpResponse } from "./httpInterface"

export interface IApp {
    adapter: IAppAdapter
    router: IAppRouter
    use(middleware: any): void
    useRoute(path: string, middleware: any): void
    start(port: number): void
}

export interface IAppRouter{
    getRouter(): IAppRouter
    post(path: string, middleware: any): void
    get(path: string, middleware: any): void
    put(path: string, middleware: any): void
    delete(path: string, middleware: any): void
    patch(path: string, middleware: any): void
    options(path: string, middleware: any): void
    head(path: string, middleware: any): void
    all(path: string, middleware: any): void
}

export interface IAppAdapter {
    toHttpRequest(req: any): IHttpRequest
    toHttpResponse(res: any): IHttpResponse
    toHttpNext(next: any): IHttpNext
}