import { nanoid } from "nanoid";
import { IAuthenticationRecovery, IAuthRecoveryRepository } from "../Interfaces/authRecoveryInterfaces.js";
import { createAuthRecoveryPasswordRepository } from "../repositories/factoryAuthenticationRepository.js";

class AuthRecoveryPasswordService {
    private static instance: AuthRecoveryPasswordService;
    private authRecoveryPasswordRepository: IAuthRecoveryRepository;

    constructor() {
        this.authRecoveryPasswordRepository = createAuthRecoveryPasswordRepository();
    }

    static getInstance(): AuthRecoveryPasswordService {
        if (!AuthRecoveryPasswordService.instance) {
            AuthRecoveryPasswordService.instance = new AuthRecoveryPasswordService();
        }
        return AuthRecoveryPasswordService.instance
    }

    async findByToken(token: string): Promise<IAuthenticationRecovery | null> {
        return await this.authRecoveryPasswordRepository.findOne({ where: { token } });
    }

    async isRecoveryTokenValid(authId: string, token: string): Promise<boolean> {
        const recoveryPassword = await this.authRecoveryPasswordRepository.findOne({where: {authenticationId: authId, token}});
        
        return recoveryPassword ? recoveryPassword.expirationDate > new Date() : false 
    }

    async create(authId: string): Promise<string> {
        
        const data = {
            authenticationId: authId,
            token: nanoid(),
            expirationDate: new Date(Date.now() + 60 * 60 * 1000),
        }
        
        const authRecovery = await this.authRecoveryPasswordRepository.create(data);
        return authRecovery.token
    }
}

export default AuthRecoveryPasswordService