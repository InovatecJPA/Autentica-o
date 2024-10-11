import { Request, Response } from "express";

export interface IAuthentication {
    id: string;
    login: string | null;
    passwordHash: string | null;
    isExternal: boolean;
    externalId: string | null;
    active: boolean;
    password_token_reset: string | null;
    password_token_expiry_date: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthenticationParams {
    login: string | null;
    passwordHash: string | null;
    externalId: string | null;
    isExternal: boolean;
    active?: boolean;
    password_token_reset?: string;
    password_expiry_date?: Date;
}

export interface IAuthenticationRepository {
    createAuthentication(authData: IAuthenticationParams): Promise<IAuthentication>;
    updateAuthentication(id: string, updateData: Partial<IAuthenticationParams>): Promise<IAuthentication>;
    findById(id: string): Promise<IAuthentication | null>;
    findAll(): Promise<IAuthentication[] | null>;
    findByLogin(login: string): Promise<IAuthentication | null>;
    findByExternalId(externalId: string): Promise<IAuthentication | null>;
    deleteAuthentication(id: string): Promise<void>;
}

export interface IAuthenticationService  {
    findAll(): Promise<IAuthentication[] | null>;
    findById(id:string): Promise<IAuthentication | null>;
    findByLogin(login: string): Promise<IAuthentication | null>;
    findByExternalId(externalId: string): Promise<IAuthentication | null>;
    createAuthentication(authData: IAuthenticationParams): Promise<void>;
    updateAuthentication(id: string, updateData: Partial<IAuthenticationParams>): Promise<void>;
    isPasswordTokenValid(id: string, token: string): Promise<boolean>;
    validatePassword(id: string, passwordHash: string): Promise<boolean>;
    authenticate(login: string, passwordHash: string): Promise<IAuthentication | null>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
    deactivateAccountAuthentication(id: string): Promise<void>;
    activateAccountAuthentication(id: string): Promise<void>;
    setPasswordTokenAndExpiryDate(id: string): Promise<void>;
    deleteAuthentication(id: string): Promise<void>;
}

export interface IAuthenticationController {
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<void>;
    createAuthentication(req: Request, res: Response): Promise<void>;
    validatePassword(req: Request, res: Response): Promise<void>;
    authenticate(req: Request, res: Response): Promise<void>;
    updateAuthentication(req: Request, res: Response): Promise<void>;
    updatePassword(req: Request, res: Response): Promise<void>;
    toogleAuthenticationStatus(req: Request, res: Response): Promise<void>;
    requestPasswordChange(req: Request, res: Response): Promise<void>;
    deleteAuthentication(req: Request, res: Response): Promise<void>;
}

export interface IAuthStrategy {
    authenticate(auth: IAuthentication): Promise<string>;
    verify(tokenOrSessionId: string): Promise<any>;
}
