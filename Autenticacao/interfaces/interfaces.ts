import exp from "constants";

export interface IAuthentication {
    id: string;
    login: string | null;
    passwordHash: string | null;
    isExternal: boolean;
    externalId: string | null;
    active: boolean;
    password_token_reset: string | null;
    password_expiry_date: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthenticationParams {
    id: string | null;
    login: string | null;
    passwordHash: string | null;
    externalId: string | null;
    isExternal: boolean;
}

export interface IAuthenticationRepository {
    saveAuthentication(authData: AuthenticationParams): Promise<IAuthentication>;
    findById(id: string): Promise<IAuthentication | null>;
    findAll(): Promise<IAuthentication[] | null>;
    findByLogin(login: string): Promise<IAuthentication | null>;
    findByExternalId(externalId: string): Promise<IAuthentication | null>;
    deleteAuthentication(id: string): Promise<void>;
}

export interface IAuthenticationService  {
    findById(id:string): Promise<IAuthentication | null>;
    findByLogin(login: string): Promise<IAuthentication | null>;
    findByExternalId(externalId: string): Promise<IAuthentication | null>;
    saveAuthentication(authData: AuthenticationParams): Promise<void>;
    isPasswordTokenValid(id: string, token: string): Promise<boolean>;
    validatePassword(id: string, passwordHash: string): Promise<void>;
    authenticate(login: string, passwordHash: string): Promise<IAuthentication | null>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
    deactivateAccountAuthentication(id: string): Promise<void>;
    activateAccountAuthentication(id: string): Promise<void>;
    setPasswordTokenAndExpiryDate(id: string, token: string): Promise<void>;
    deleteAuthentication(id: string): Promise<void>;
}