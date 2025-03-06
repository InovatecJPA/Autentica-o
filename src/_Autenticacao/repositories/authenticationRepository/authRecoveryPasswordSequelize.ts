import { models } from "../../../sequelize/models/index.js";
import { IAuthenticationRecovery, IAuthRecoveryRepository } from "../../Interfaces/authRecoveryInterfaces.js";

class AuthRecoveryPasswordRepositorySequelize implements IAuthRecoveryRepository {
    async findAll(options = {}): Promise<IAuthenticationRecovery[]> {
        return models.authPasswordRecoveryModelSequelize.findAll(options);
    }

    async findOne(options = {}): Promise<IAuthenticationRecovery | null> {
        return models.authPasswordRecoveryModelSequelize.findOne(options);
    }

    async create(data: IAuthenticationRecovery): Promise<IAuthenticationRecovery> {
        return models.authPasswordRecoveryModelSequelize.create(data);
    }

}

export default AuthRecoveryPasswordRepositorySequelize