import { IGrantsRepository } from "../Interfaces/grantsInterfaces.js";
import { IProfileRepository } from "../Interfaces/profileInterfaces.js";
import GrantsRepositorySequelize from "./grantsRepository/grantsRepositorySequelize.js";
import ProfileRepositorySequelize from "./profileRepository/profileRepositorySequelize.js";

function createProfileRepository(): IProfileRepository {
    
    if (process.env.AUTHORIZATION_REPOSITORY === 'sequelize') {
        return new ProfileRepositorySequelize();
    }

    throw new Error("Repository not found");
}

function createGrantsRepository(): IGrantsRepository {
    
    if (process.env.AUTHORIZATION_REPOSITORY === 'sequelize') {       
        return new GrantsRepositorySequelize();
    }

    throw new Error("Repository not found");
}

export {
    createProfileRepository,
    createGrantsRepository
}