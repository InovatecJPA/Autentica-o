import { IAuthenticationRecovery } from "../Interfaces/authRecoveryInterfaces.js";
import { AuthRecoveryPasswordSchema } from "../schemas/authRecoveryPassword.schema.js";



class AuthRecoveryPassword implements IAuthenticationRecovery {
    public id?: number;
    public authenticationId: string;
    public token: string;
    public expirationDate: Date;
    public createdAt: Date;

    constructor( data: IAuthenticationRecovery) {
        this.authenticationId = data.authenticationId;
        this.token = data.token;
        this.expirationDate = data.expirationDate
        this.createdAt = new Date();
    }

    public static create(data: unknown): AuthRecoveryPassword {
        const parsedData = AuthRecoveryPasswordSchema.parse(data);
        return new AuthRecoveryPassword(parsedData)
    }
}


export default AuthRecoveryPassword