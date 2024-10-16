import { IHttpNext, IHttpRequest, IHttpResponse } from "./httpInterface"

export interface IApp {
    use(middleware: any): void
    start(port: number): void
}

export interface IFrameworkAdapter {
    toHttpRequest(req: any): IHttpRequest
    toHttpResponse(res: any): IHttpResponse
    toHttpNext(next: any): IHttpNext
}