import { IHttpAuthenticatedRequest, IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";

export interface IAuthentication {
    id: string;
    login: string | null;
    passwordHash: string | null;
    isExternal: boolean;
    externalId: string | null;
    active: boolean;
    password_token_reset: string | null;
    password_token_expiry_date: Date | null;
    profileId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthenticationParams {
    login: string | null;
    passwordHash: string | null;
    externalId: string | null;
    isExternal: boolean;
    profileId: string | null;
    active?: boolean;
    password_token_reset?: string;
    password_token_expiry_date?: Date;
}

export interface IAuthenticationRepository {
    createAuthentication(authData: IAuthentication): Promise<IAuthentication>;
    updateAuthentication(id: string, updateData: Partial<IAuthenticationParams>): Promise<IAuthentication>;
    findById(id: string): Promise<IAuthentication | null>;
    findByToken(token: string): Promise<IAuthentication | null>;
    findAll(): Promise<IAuthentication[] | null>;
    findByLogin(login: string): Promise<IAuthentication | null>;
    findByExternalId(externalId: string): Promise<IAuthentication | null>;
    deleteAuthentication(id: string): Promise<void>;
}

export interface IAuthenticationService  {
    findAll(): Promise<IAuthentication[] | null>;
    findByToken(token: string): Promise<IAuthentication | null>;
    findById(id:string): Promise<IAuthentication | null>;
    findByLogin(login: string): Promise<IAuthentication | null>;
    findByExternalId(externalId: string): Promise<IAuthentication | null>;
    createStandartAuthentication(authData: IAuthenticationParams): Promise<void>;
    updateAuthentication(id: string, updateData: Partial<IAuthenticationParams>): Promise<void>;
    isPasswordTokenValid(id: string, token: string): Promise<boolean>;
    validatePassword(id: string, passwordHash: string): Promise<boolean>;
    authenticate(login: string, passwordHash: string): Promise<IAuthentication | null>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
    deactivateAccountAuthentication(id: string): Promise<void>;
    activateAccountAuthentication(id: string): Promise<void>;
    setPasswordTokenAndExpiryDate(id: string): Promise<void>;
    deleteAuthentication(id: string): Promise<void>;
    createExternalAuthentication(authData: IAuthenticationParams): Promise<void>;
}

export interface IAuthenticationController {
    findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    createAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    authenticate(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    updateAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    requestPasswordChange(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    deleteAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    validatePassword(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    updatePassword(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    toggleAuthenticationStatus(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
    updatePasswordEmail(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>;
}


export interface IAuthStrategy {
    authenticate(req: IHttpRequest,auth: Partial<IAuthentication>): Promise<string>;
    verify(tokenOrSessionId: string): Promise<object | string>;
    checkAuthentication(req: IHttpAuthenticatedRequest): Promise<object>;
}


