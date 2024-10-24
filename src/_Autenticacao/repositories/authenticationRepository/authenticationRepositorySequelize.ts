import { IAuthenticationParams, IAuthentication, IAuthenticationRepository } from "../../Interfaces/authInterfaces";
import { models } from "../../../sequelize/models";

class AuthenticationRepositorySequelize implements IAuthenticationRepository {
    /**
     * Encontra uma autenticao pelo seu id.
     * @param {string} id
     * @returns {Promise<IAuthentication | null>}
     */
    async findById(id: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({where: {id: id}});
    }

    async findByToken(token: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({where: {password_token_reset: token}});
    }
    
    /**
     * Encontra todas as autenticacoes no banco de dados.
     * @returns {Promise<IAuthentication[] | null>}
     */
    async findAll(): Promise<IAuthentication[] | null> {
        return await models.AuthenticationModelSequelize.findAll();
    }

    /**
     * Encontra uma autenticao pelo seu login.
     * @param {string} login
     * @returns {Promise<IAuthentication | null>}
     */
    async findByLogin(login: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({where: {login: login}});
    }

    /**
     * Encontra uma autenticao pelo seu externalId.
     * @param {string} externalId
     * @returns {Promise<IAuthentication | null>}
     */
    async findByExternalId(externalId: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({where: {externalId: externalId}});
    }



    async createAuthentication(auth: IAuthentication): Promise<IAuthentication> {
        return await models.AuthenticationModelSequelize.create(auth);
    }


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
     * Deleta uma autenticao do banco de dados.
     * @param {string} id
     * @returns {Promise<void>}
     */
    async deleteAuthentication(id: string): Promise<void> {
        await models.AuthenticationModelSequelize.destroy({where: {id: id}});
    }

}

export default AuthenticationRepositorySequelize;