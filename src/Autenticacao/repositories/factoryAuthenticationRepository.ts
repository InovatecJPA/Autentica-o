import { IAuthenticationRepository } from "../interfaces/authInterfaces";
import authenticationRepositoryAlternativo from "./authenticationRepository/authenticationRepositoryAlternativo";
import authenticationRepositorySequelize from "./authenticationRepository/authenticationRepositorySequelize";
import dotenv from 'dotenv';
dotenv.config();

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