import { IAuthenticationParams, IAuthentication, IAuthenticationRepository } from "../../authInterfaces/authInterfaces";
import Authentication from "../../models/authenticationModel";
import AuthenticationModelSequelize from "../../models/sequelize/authenticationModelSequelize";

class AuthenticationRepositorySequelize implements IAuthenticationRepository {
    /**
     * Encontra uma autenticao pelo seu id.
     * @param {string} id
     * @returns {Promise<IAuthentication | null>}
     */
    async findById(id: string): Promise<IAuthentication | null> {
        return await AuthenticationModelSequelize.findOne({where: {id: id}});
    }
    
    /**
     * Encontra todas as autenticacoes no banco de dados.
     * @returns {Promise<IAuthentication[] | null>}
     */
    async findAll(): Promise<IAuthentication[] | null> {
        return await AuthenticationModelSequelize.findAll();
    }

    /**
     * Encontra uma autenticao pelo seu login.
     * @param {string} login
     * @returns {Promise<IAuthentication | null>}
     */
    async findByLogin(login: string): Promise<IAuthentication | null> {
        return await AuthenticationModelSequelize.findOne({where: {login: login}});
    }

    /**
     * Encontra uma autenticao pelo seu externalId.
     * @param {string} externalId
     * @returns {Promise<IAuthentication | null>}
     */
    async findByExternalId(externalId: string): Promise<IAuthentication | null> {
        return await AuthenticationModelSequelize.findOne({where: {externalId: externalId}});
    }



    async createAuthentication(authData: IAuthenticationParams): Promise<IAuthentication> {
        const auth = new Authentication(authData);
        return await AuthenticationModelSequelize.create(auth);
    }


    async updateAuthentication(id: string, updateData: Partial<IAuthenticationParams>): Promise<IAuthentication> {
        const [affectedCount, updatedRows] = await AuthenticationModelSequelize.update(
            { ...updateData, updatedAt: new Date() },
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
        await AuthenticationModelSequelize.destroy({where: {id: id}});
    }

}

export default AuthenticationRepositorySequelize;