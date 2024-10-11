import Authentication from "../../models/authenticationModel";
import AuthenticationModelSequelize from "../../models/sequelize/authenticationModelSequelize";
class AuthenticationRepositorySequelize {
    /**
     * Encontra uma autenticao pelo seu id.
     * @param {string} id
     * @returns {Promise<IAuthentication | null>}
     */
    async findById(id) {
        return await AuthenticationModelSequelize.findOne({ where: { id: id } });
    }
    /**
     * Encontra todas as autenticacoes no banco de dados.
     * @returns {Promise<IAuthentication[] | null>}
     */
    async findAll() {
        return await AuthenticationModelSequelize.findAll();
    }
    /**
     * Encontra uma autenticao pelo seu login.
     * @param {string} login
     * @returns {Promise<IAuthentication | null>}
     */
    async findByLogin(login) {
        return await AuthenticationModelSequelize.findOne({ where: { login: login } });
    }
    /**
     * Encontra uma autenticao pelo seu externalId.
     * @param {string} externalId
     * @returns {Promise<IAuthentication | null>}
     */
    async findByExternalId(externalId) {
        return await AuthenticationModelSequelize.findOne({ where: { externalId: externalId } });
    }
    async createAuthentication(authData) {
        const auth = new Authentication(authData);
        return await AuthenticationModelSequelize.create(auth);
    }
    async updateAuthentication(id, updateData) {
        const [affectedCount, updatedRows] = await AuthenticationModelSequelize.update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { where: { id }, returning: true });
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
    async deleteAuthentication(id) {
        await AuthenticationModelSequelize.destroy({ where: { id: id } });
    }
}
export default AuthenticationRepositorySequelize;
