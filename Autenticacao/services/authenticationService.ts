import createAuthenticationRepository from "../repositories/authenticationRepository/factoryAuthenticationRepository";
import { AuthenticationParams, IAuthentication, IAuthenticationRepository, IAuthenticationService } from "../interfaces/interfaces";

class AuthenticationService implements IAuthenticationService {

    private authRepository: IAuthenticationRepository = createAuthenticationRepository();

    /**
     * Encontra uma autenticao pelo seu id.
     * @param {string} id
     * @returns {Promise<IAuthentication | null>}
     */
    async findById(id: string): Promise<IAuthentication | null> {
        return await this.authRepository.findById(id);
    }

    /**
     * Encontra uma autenticao pelo seu login.
     * @param {string} login
     * @returns {Promise<IAuthentication | null>}
     */
    async findByLogin(login: string): Promise<IAuthentication | null> {
        return await this.authRepository.findByLogin(login);
    }

    /**
     * Encontra uma autenticao pelo seu externalId.
     * @param {string} externalId
     * @returns {Promise<IAuthentication | null>}
     */
    async findByExternalId(externalId: string): Promise<IAuthentication | null> {
        return await this.authRepository.findByExternalId(externalId);
    }

    /**
     * Encontra todas as autenticacoes no banco de dados.
     * @returns {Promise<IAuthentication[] | null>}
     */
    async findAll(): Promise<IAuthentication[] | null> {
        return await this.authRepository.findAll();
    }

    /**
     * Salva autenticao no banco de dados.
     * Caso ja exista uma autenticao com o mesmo login, atualiza a mesma.
     * Caso contrario, salva uma nova autenticao.
     * @param {{login?: string | null, passwordHash?: string | null, externalId: string | null, isExternal: boolean}} authData
     * @returns {Promise<void>}
     */
    async saveAuthentication(authData: AuthenticationParams): Promise<void> {
        await this.authRepository.saveAuthentication(authData);
    }

    async deleteAuthentication(id: string): Promise<void> {
        await this.authRepository.deleteAuthentication(id);
    }

    updatePassword(id: string, passwordHash: string): Promise<void> {
        throw new Error("Method not implemented.");
    }


    isPasswordTokenValid(id: string, token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    validatePassword(id: string, passwordHash: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    authenticate(login: string, passwordHash: string): Promise<IAuthentication | null> {
        throw new Error("Method not implemented.");
    }

    deactivateAccountAuthentication(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    activateAccountAuthentication(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setPasswordTokenAndExpiryDate(id: string, token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}