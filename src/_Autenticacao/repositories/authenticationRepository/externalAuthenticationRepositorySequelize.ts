import { models } from "../../../sequelize/models";
import { IExternalAuthentication, IExternalAuthenticationRepository } from "../../Interfaces/authInterfaces";

class ExternalAuthenticationRepositorySequelize implements IExternalAuthenticationRepository {
    async findAll(): Promise<IExternalAuthentication[] | null> {
        return await models.ExternalAuthenticationModelSequelize.findAll();
    }

    async findByAuthenticationId(authentication_id: string): Promise<IExternalAuthentication[]> {
        return await models.ExternalAuthenticationModelSequelize.findAll({where: {authentication_id}});
    }

    async findByExternalId(external_id: string): Promise<IExternalAuthentication | null> {
        return await models.ExternalAuthenticationModelSequelize.findOne({where: {external_id}});
    }

    async findByProvider(provider: string): Promise<IExternalAuthentication[]> {
        return await models.ExternalAuthenticationModelSequelize.findAll({where: {provider}});
    }

    async createExternalAuthentication(externalAuthentication: IExternalAuthentication): Promise<IExternalAuthentication> {
        return await models.ExternalAuthenticationModelSequelize.create(externalAuthentication);
    }

    async updateExternalAuthentication(externalAuthentication: Partial<IExternalAuthentication>): Promise<IExternalAuthentication> {
        const filteredUpdateData = Object.fromEntries(
            Object.entries(externalAuthentication).filter(([_, value]) => value !== null)
        )

        const [affectedCount, updatedRows] = await models.ExternalAuthenticationModelSequelize.update(
            { ...filteredUpdateData, updatedAt: new Date() },
            { where: { external_id: externalAuthentication.external_id }, returning: true }
        )

        if (affectedCount === 0) {
            throw new Error('ExternalAuthentication not found');
        }

        return updatedRows[0];
    }

    async deleteExternalAuthentication(externalAuthentication: IExternalAuthentication): Promise<void> {
        await models.ExternalAuthenticationModelSequelize.destroy({where: {external_id: externalAuthentication.external_id}})
    }
}

export default ExternalAuthenticationRepositorySequelize