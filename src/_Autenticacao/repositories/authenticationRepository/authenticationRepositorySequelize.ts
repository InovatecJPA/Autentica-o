import { IAuthenticationParams, IAuthentication, IAuthenticationRepository } from "../../Interfaces/authInterfaces";
import { models } from "../../../sequelize/models";

class AuthenticationRepositorySequelize implements IAuthenticationRepository {
    /**
     * @inheritdoc
     */
    async findById(id: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({
            where: {id: id},
            attributes : {exclude: ['passwordHash', 'password_token_reset']}
        });
    }

    /**
     * @inheritdoc
     */
    async findByToken(token: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({
            where: {password_token_reset: token},
            attributes : {exclude: ['passwordHash', 'password_token_reset']}
        });
    }
    
    /**
     * @inheritdoc
     */
    async findAll(): Promise<IAuthentication[]> {
        return await models.AuthenticationModelSequelize.findAll({
            attributes : {exclude: ['passwordHash', 'password_token_reset']}
        });
    }

    /**
     * @inheritdoc
     */
    async findByLogin(login: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({
            where: {login: login},
            attributes : {exclude: ['passwordHash', 'password_token_reset']}
        });
    }

    /**
     * @inheritdoc
     */
    async findByExternalId(externalId: string): Promise<IAuthentication | null> {
        return await models.AuthenticationModelSequelize.findOne({
            where: {externalId: externalId},
            attributes : {exclude: ['passwordHash', 'password_token_reset']}
        });
    }


    /**
     * @inheritdoc
     */
    async createAuthentication(auth: IAuthentication): Promise<IAuthentication> {
        const { passwordHash, password_token_reset, ...newAuth} = await models.AuthenticationModelSequelize.create(auth);
        return {...newAuth, passwordHash: null, password_token_reset: null};
        
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

        const { passwordHash, password_token_reset, ...updatedAuth} = updatedRows[0];
        return {...updatedAuth, passwordHash: null, password_token_reset: null};
    }
    
    /**
     * @inheritdoc
     */
    async deleteAuthentication(id: string): Promise<void> {
        await models.AuthenticationModelSequelize.destroy({where: {id: id}});
    }

}

export default AuthenticationRepositorySequelize;