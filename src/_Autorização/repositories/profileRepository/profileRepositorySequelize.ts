import { models } from "../../../sequelize/models";
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

    async addGrantToProfile(profile: ProfileModelSequelize, grants: GrantsModelSequelize): Promise<void> {
        await profile.addGrant(grants);
    }

    async addGrantsToProfile(profile: ProfileModelSequelize, grants: GrantsModelSequelize[]): Promise<void> {
        await profile.addGrants(grants);
    }

    async removeGrantFromProfile(profile: ProfileModelSequelize, grants: GrantsModelSequelize): Promise<void> {
        await profile.removeGrant(grants);
    }

    async removeGrantsFromProfile(profile: ProfileModelSequelize, grants: GrantsModelSequelize[]): Promise<void> {
        await profile.removeGrants(grants);
    }

    async getGrantsByProfileId(profile: ProfileModelSequelize): Promise<GrantsModelSequelize[]> {
        return await profile.getGrants();
    }
}

export default ProfileRepositorySequelize