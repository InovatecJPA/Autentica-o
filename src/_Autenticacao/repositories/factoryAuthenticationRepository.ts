import { IAuthenticationRepository, IExternalAuthenticationRepository } from "../Interfaces/authInterfaces.js";
import authenticationRepositorySequelize from "./authenticationRepository/authenticationRepositorySequelize.js";
import externalAuthenticationRepositorySequelize from "./authenticationRepository/externalAuthenticationRepositorySequelize.js";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Define qual o tipo de repositório que sera utilizado com base no .env
 * @returns {IAuthenticationRepository}
 */
function createAuthenticationRepository(): IAuthenticationRepository {
    if (process.env.AUTHENTICATION_REPOSITORY === "sequelize") {
        return new authenticationRepositorySequelize();
    }
    
   throw new Error("Repository not found");
}

function createExternalAuthenticationRepository(): IExternalAuthenticationRepository {
    if (process.env.AUTHENTICATION_REPOSITORY === "sequelize") {
        return new externalAuthenticationRepositorySequelize();
    }
    
   throw new Error("Repository not found");
}

export {
    createAuthenticationRepository,
    createExternalAuthenticationRepository
};