import { AuthenticationParams, IAuthentication, IAuthenticationRepository } from "../../interfaces/interfaces";
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



    /**
     * Salva autenticao no banco de dados.
     * Caso ja exista uma autenticao com o mesmo login, atualiza a mesma.
     * Caso contrario, salva uma nova autenticao.
     * @param {{login?: string | null, passwordHash?: string | null, externalId: string | null, isExternal: boolean, id?: string}} authData
     * @returns {Promise<IAuthentication>}
     */
    async saveAuthentication(authData: AuthenticationParams): Promise<IAuthentication> {
        if (authData.id && await this.findById(authData.id)) {
            const {id, ...updateData} = authData;
            const [affectedCount, updatedRows] = await AuthenticationModelSequelize.update({...updateData, updatedAt: new Date()}, {where: {id: authData.id}, returning: true});
            return updatedRows[0];
        }else {
            const auth = new Authentication(authData);
            return await AuthenticationModelSequelize.create(auth);
        }
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