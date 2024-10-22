import { IAuthenticationRepository } from "../Interfaces/authInterfaces";
import authenticationRepositorySequelize from "./authenticationRepository/authenticationRepositorySequelize";
import dotenv from 'dotenv';
dotenv.config();

function createAuthenticationRepository(): IAuthenticationRepository {
    if (process.env.AUTHENTICATION_REPOSITORY === "sequelize") {
        return new authenticationRepositorySequelize();
    }
    
   throw new Error("Repository not found");
}

export default createAuthenticationRepository;