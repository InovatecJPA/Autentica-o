import { IAuthenticationRepository } from "../../interfaces/interfaces";
import authenticationRepositoryAlternativo from "./authenticationRepositoryAlternativo";
import authenticationRepositorySequelize from "./authenticationRepositorySequelize";

function createAuthenticationRepository(): IAuthenticationRepository {
    if (process.env.AUTHENTICATION_REPOSITORY === "alternativo")  {
        return new authenticationRepositoryAlternativo();
    }

    if (process.env.AUTHENTICATION_REPOSITORY === "sequelize") {
        return new authenticationRepositorySequelize();
    }
    
   throw new Error("Repository not found");
}

export default createAuthenticationRepository;