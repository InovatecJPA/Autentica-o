import { models } from "../../../sequelize/models";
import GrantsModelSequelize from "../../../sequelize/models/grantsModelSequelize";
import { IGrants, IGrantsParams, IGrantsRepository } from "../../Interfaces/grantsInterfaces";
import { IProfile } from "../../Interfaces/profileInterfaces";
import Grants from "../../models/grantsModel";

class GrantsRepositorySequelize implements IGrantsRepository{
    
    async findAll(): Promise<IGrants[]> {
        return await models.GrantsModelSequelize.findAll()
    }

    async findByIds(ids: string[]): Promise<IGrants[]> {
        return await models.GrantsModelSequelize.findAll({where: {id: ids}})
    }

    async findById(id: string): Promise<IGrants | null> {
        return await models.GrantsModelSequelize.findOne({where: {id: id}})
    }

    async findByMethodAndPath(method: string, path: string): Promise<IGrants | null> {
        return await models.GrantsModelSequelize.findOne({where: {method: method, path: path}})
    }

    async createGrants(grants: IGrants): Promise<IGrants | null> {
        return await models.GrantsModelSequelize.create(grants)
    }

    async updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants> {
        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== null)
        )

        const [affectedCount, updatedRows] = await models.GrantsModelSequelize.update(
            { ...filteredUpdateData, updatedAt: new Date() },
            { where: { id }, returning: true }
        )

        if (affectedCount === 0) {
            throw new Error('Grants not found');
        }

        return updatedRows[0];
    }


    async deleteGrants(id: string): Promise<void> {
        await models.GrantsModelSequelize.destroy({where: {id: id}});
    }

    async getProfilesByGrantsId(grants: GrantsModelSequelize): Promise<IProfile[]> {
        return await grants.getProfiles();
    }
    
}

export default GrantsRepositorySequelize