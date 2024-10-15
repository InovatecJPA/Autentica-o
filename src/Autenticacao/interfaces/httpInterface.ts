import { IAuthentication } from "../interfaces/authInterfaces";

export interface IHttpRequest {
    body: any;
    query: any;
    params: any;
    headers: any;
    session?: any;
    auth?: Partial<IAuthentication>;
}

export interface IHttpResponse {
    status(code: number): this;
    json(data: any): this;
    send(data: any): this;
}
