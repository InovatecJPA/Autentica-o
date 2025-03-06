import { FindOptions } from "sequelize";

export interface IAuthenticationRecovery {
    id?: number;
    authenticationId: string;
    token: string;
    expirationDate: Date;
    createdAt?: Date;
}

export interface IAuthRecoveryRepository {
    findAll(options: FindOptions): Promise<IAuthenticationRecovery[]>
    findOne(options: FindOptions): Promise<IAuthenticationRecovery | null>
    create(data: IAuthenticationRecovery): Promise<IAuthenticationRecovery>
}