import createAuthenticationRepository from "../repositories/factoryAuthenticationRepository";
import { IAuthenticationParams, IAuthentication, IAuthenticationRepository, IAuthenticationService } from "../Interfaces/authInterfaces";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import HttpError from "../../utils/customErrors/httpError";
import Authentication from "../models/authenticationModel";


class AuthenticationService implements IAuthenticationService {
    private static instance: AuthenticationService;
    private authRepository: IAuthenticationRepository;

    /**
     * Private constructor to create the AuthenticationService instance.
     * This constructor is private to force the use of the singleton pattern.
     * The authentication repository is created here and stored in the instance.
     */
    private constructor() {
        this.authRepository = createAuthenticationRepository();
    }

    /**
     * Retorna a nica inst ncia da classe AuthenticationService.
     * Caso a inst ncia n o tenha sido criada ainda, cria uma nova inst ncia
     * e a retorna.
     * @returns {AuthenticationService} A nica inst ncia da classe.
     */
    static getInstance(): AuthenticationService {
        if (!AuthenticationService.instance) {
            AuthenticationService.instance = new AuthenticationService();
        }
        
        return AuthenticationService.instance;
    }   
    
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

    async findByToken(token: string): Promise<IAuthentication | null> {
        return await this.authRepository.findByToken(token);
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
    async createStandartAuthentication(authData: IAuthenticationParams): Promise<void> {
        let auth = await this.authRepository.findByLogin(authData.login!);
        
        if (auth) {
            throw new HttpError(409, 'Authentication already exists');
        }

        const salt = bcrypt.genSaltSync(10);
        const password = await bcrypt.hash(authData.passwordHash!, salt);
        authData.passwordHash = password 

        auth = new Authentication(authData);

        await this.authRepository.createAuthentication(auth);
    }

    async createExternalAuthentication(authData: IAuthenticationParams): Promise<void> {
        let auth = await this.authRepository.findByExternalId(authData.externalId!);
        
        if (auth) {
            throw new HttpError(409, 'Authentication already exists');
        }
        
        auth = new Authentication(authData);
        await this.authRepository.createAuthentication(auth);
    }

    
async updateAuthentication(id: string, authData: Partial<IAuthenticationParams>): Promise<void> {
    const auth = await this.authRepository.findById(id);
    if (!auth) {
        throw new HttpError(404, 'Authentication not found');
    }
    
    const filteredData = Object.entries(authData)
        .filter(([_, value]) => value !== null && value !== undefined && 
            !(typeof value === 'string' && value.trim() === ''))
        .reduce((acc, [key, value]) => {
            acc[key as keyof IAuthenticationParams] = value as any
            return acc
        }, {} as Partial<IAuthenticationParams>)

    if (Object.keys(filteredData).length === 0) {
        throw new HttpError(400, 'No data to update');
    }

    await this.authRepository.updateAuthentication(id, filteredData);
}

    /**
     * Deleta uma autenticao do banco de dados.
     * @param {string} id
     * @returns {Promise<void>}
     */
    async deleteAuthentication(id: string): Promise<void> {
        await this.authRepository.deleteAuthentication(id);
    }

    /**
     * Atualiza a senha de uma autenticao no banco de dados.
     * @param {string} id
     * @param {string} password
     * @returns {Promise<void>}
     */
    async updatePassword(id: string, password: string): Promise<void> {
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = await bcrypt.hash(password, salt);
        await this.authRepository.updateAuthentication(id, {passwordHash});
    }


    /**
     * Verifica se o token de redefini o de senha  vlido para uma autenticao.
     * @param {string} id - O id da autenticao.
     * @param {string} token - O token de redefini o de senha.
     * @returns {Promise<boolean>} Retorna true se o token for vlido, false caso contr rio.
     */
    async isPasswordTokenValid(id: string, token: string): Promise<boolean> {
        const auth: IAuthentication | null = await this.authRepository.findById(id);
        if (!auth) {
            throw new Error('Authentication not found');
        }
        if (!auth.password_token_reset || !auth.password_token_expiry_date || auth.password_token_expiry_date < new Date()) {
            return false;
        }
        return auth.password_token_reset === token;   
    }
     
    /**
     * Verifica se a senha de uma autenticao  vlida.
     * @param {string} id - O id da autenticao.
     * @param {string} passwordHash - A senha Hash.
     * @returns {Promise<void>} Retorna uma promessa que resolve se a senha for vlida e reject caso contr rio.
     * @throws {Error} Caso a autenticao n o seja encontrada.
     */
    async validatePassword(id: string, passwordHash: string): Promise<boolean> {
        const auth = await this.authRepository.findById(id);
        if (!auth || !auth.passwordHash) {
            throw new Error('Authentication not found');
        }
        return bcrypt.compare(passwordHash, auth.passwordHash);
    }

    /**
     * Realiza a autenticao de um usu rio.
     * @param {string} login - O login do usu rio.
     * @param {string} passwordHash - A senha Hash do usu rio.
     * @returns {Promise<IAuthentication | null>} Retorna a autenticao se a senha for vlida e null caso contr rio.
     */
    async authenticate(login: string, passwordHash: string): Promise<IAuthentication | null> {
        const auth: IAuthentication | null = await this.authRepository.findByLogin(login);
        
        if (!auth) {
            return null;
        }

        if(auth.active === false) {
            throw new HttpError(403, 'Usuário inativo');
        }

        if (await this.validatePassword(auth.id, passwordHash)) {
            return auth;
        }
        return null;
    };   
        
    /**
     * Desativa uma autenticao de uma conta.
     * @param {string} id - O id da autenticao.
     * @returns {Promise<void>} Retorna uma promessa que resolve caso a opera o seja bem sucedida.
     */
    async deactivateAccountAuthentication(id: string): Promise<void> {
        await this.authRepository.updateAuthentication(id, {active: false});
    }

    /**
     * Ativa uma autenticao de uma conta.
     * @param {string} id - O id da autenticao.
     * @returns {Promise<void>} Retorna uma promessa que resolve caso a opera o seja bem sucedida.
     */
    async activateAccountAuthentication(id: string): Promise<void> {
        await this.authRepository.updateAuthentication(id, {active: true});
    }


    async setPasswordTokenAndExpiryDate(id: string): Promise<void> {
        const token = nanoid();

        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getHours() + 1);

        await this.authRepository.updateAuthentication(id, {password_token_reset: token, password_token_expiry_date: expiryDate});
    }

}

export default AuthenticationService.getInstance();