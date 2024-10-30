import { IAuthenticationParams, IAuthentication, IAuthenticationRepository } from "../../Interfaces/authInterfaces";
import { models } from "../../../sequelize/models";

class AuthenticationRepositorySequelize implements IAuthenticationRepository {
    /**
     * @inheritdoc
     */
    async findById(id: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({where: {id: id}});
    }

    /**
     * @inheritdoc
     */
    async findByToken(token: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({where: {password_token_reset: token}});
    }
    
    /**
     * @inheritdoc
     */
    async findAll(): Promise<IAuthentication[] | null> {
        return await models.AuthenticationModelSequelize.findAll();
    }

    /**
     * @inheritdoc
     */
    async findByLogin(login: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({where: {login: login}});
    }

    /**
     * @inheritdoc
     */
    async findByExternalId(externalId: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({where: {externalId: externalId}});
    }


    /**
     * @inheritdoc
     */
    async createAuthentication(auth: IAuthentication): Promise<IAuthentication> {
        return await models.AuthenticationModelSequelize.create(auth);
    }

    /**
     * @inheritdoc
     */
    async updateAuthentication(id: string, updateData: Partial<IAuthenticationParams>): Promise<IAuthentication> {
        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== null)
        );
        
        const [affectedCount, updatedRows] = await models.AuthenticationModelSequelize.update(
            { ...filteredUpdateData, updatedAt: new Date() },
            { where: { id }, returning: true }
        );

        if (affectedCount === 0) {
            throw new Error('Authentication not found');
        }

        return updatedRows[0];
    }
    
    /**
     * @inheritdoc
     */
    async deleteAuthentication(id: string): Promise<void> {
        await models.AuthenticationModelSequelize.destroy({where: {id: id}});
    }

}

export default AuthenticationRepositorySequelize;