import { IProfileRepository } from "../Interfaces/profileInterfaces.js";
import ProfileRepositorySequelize from "./profileRepository/profileRepositorySequelize.js";

function createProfileRepository(): IProfileRepository {
    
    if (process.env.AUTHORIZATION_REPOSITORY === 'sequelize') {
        return new ProfileRepositorySequelize();
    }

    throw new Error("Repository not found");
}

export {
    createProfileRepository
}