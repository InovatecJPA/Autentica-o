import { IAuthentication } from "../../../_Autenticacao/Interfaces/authInterfaces.js";
import { models } from "../../../sequelize/models/index.js";
import AuthenticationModelSequelize from "../../../sequelize/models/authenticationModelSequelize.js";
import ProfileModelSequelize from "../../../sequelize/models/profileModelSequelize.js";
import { IProfile, IProfileParams, IProfileRepository } from "../../Interfaces/profileInterfaces.js";

class ProfileRepositorySequelize implements IProfileRepository {
    async findAll(): Promise<IProfile[]> {
        return await models.profileModelSequelize.findAll();
    }

    async findById(id: string): Promise<IProfile | null> {
        return await models.profileModelSequelize.findByPk(id);
    }

    async findByIds(ids: string[]): Promise<IProfile[]> {
        return await models.profileModelSequelize.findAll({ where: { id: ids } });
    }

    async findByName(name: string): Promise<IProfile | null> {
        return await models.profileModelSequelize.findOne({ where: { name } });
    }

    async createProfile(profile: IProfile): Promise<IProfile | null> {
        return await models.profileModelSequelize.create(profile)
    }

    async updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<IProfile> {
        const FilteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== null)
        )
        
        const [affectedCount, updatedRows] = await models.profileModelSequelize.update(
            { ...FilteredUpdateData, updatedAt: new Date() },
            { where: { id }, returning: true }
        )

        if (affectedCount === 0) {
            throw new Error('Profile not found');
        }

        return updatedRows[0];
    }

    async deleteProfile(id: string): Promise<void> {
        await models.profileModelSequelize.destroy({ where: { id } });
    }   

    async getAuthenticationsByProfileId(profile: ProfileModelSequelize): Promise<IAuthentication[]> {
        return await profile.getAuthentications({
            attributes: {exclude: ['passwordHash', 'password_token_reset']}
        });
    }


    async addProfilesToAuthentication(profiles: ProfileModelSequelize[], auth: AuthenticationModelSequelize, options?:object): Promise<void> {
        for (const profile of profiles) {
            await profile.addAuthentications(auth, options);
        }
    }
    
    async removeProfilesFromAuthentication(profiles: ProfileModelSequelize[], auth: AuthenticationModelSequelize): Promise<void> {
        for (const profile of profiles) {
            await profile.removeAuthentications(auth);
        }
    }
}

export default ProfileRepositorySequelize