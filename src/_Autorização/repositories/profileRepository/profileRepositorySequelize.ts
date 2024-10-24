import { IAuthentication } from "../../../_Autenticacao/Interfaces/authInterfaces";
import { models } from "../../../sequelize/models";
import AuthenticationModelSequelize from "../../../sequelize/models/authenticationModelSequelize";
import GrantsModelSequelize from "../../../sequelize/models/grantsModelSequelize";
import ProfileModelSequelize from "../../../sequelize/models/profileModelSequelize";
import { IProfile, IProfileParams, IProfileRepository } from "../../Interfaces/profileInterfaces";

class ProfileRepositorySequelize implements IProfileRepository {
    async findAll(): Promise<IProfile[]> {
        return await models.ProfileModelSequelize.findAll();
    }

    async findById(id: string): Promise<IProfile | null> {
        return await models.ProfileModelSequelize.findByPk(id);
    }

    async findByIds(ids: string[]): Promise<IProfile[]> {
        return await models.ProfileModelSequelize.findAll({ where: { id: ids } });
    }

    async findByName(name: string): Promise<IProfile | null> {
        return await models.ProfileModelSequelize.findOne({ where: { name } });
    }

    async createProfile(profile: IProfile): Promise<IProfile | null> {
        return await models.ProfileModelSequelize.create(profile)
    }

    async updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<IProfile> {
        const FilteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== null)
        )
        
        const [affectedCount, updatedRows] = await models.ProfileModelSequelize.update(
            { ...FilteredUpdateData, updatedAt: new Date() },
            { where: { id }, returning: true }
        )

        if (affectedCount === 0) {
            throw new Error('Profile not found');
        }

        return updatedRows[0];
    }

    async deleteProfile(id: string): Promise<void> {
        await models.ProfileModelSequelize.destroy({ where: { id } });
    }   

    async getAuthenticationsByProfileId(profile: ProfileModelSequelize): Promise<IAuthentication[]> {
        return await profile.getAuthentications();
    }

    async addProfilesToAuthentication(profiles: ProfileModelSequelize[], auth: AuthenticationModelSequelize): Promise<void> {
        for (const profile of profiles) {
            await profile.addAuthentication(auth);
        }
    }
    
    async removeProfilesFromAuthentication(profiles: ProfileModelSequelize[], auth: AuthenticationModelSequelize): Promise<void> {
        for (const profile of profiles) {
            await profile.removeAuthentication(auth);
        }
    }


    async getGrantsByProfileId(profile: ProfileModelSequelize): Promise<GrantsModelSequelize[]> {
        return await profile.getGrants();
    }

    async addProfileToGrants(profile: ProfileModelSequelize, grants: GrantsModelSequelize[]): Promise<void> {
        await profile.addGrants(grants);
    }

    async removeProfileFromGrants(profile: ProfileModelSequelize, grants: GrantsModelSequelize[]): Promise<void> {
        await profile.removeGrants(grants);
    }

}

export default ProfileRepositorySequelize