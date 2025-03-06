import {createAuthenticationRepository} from "../repositories/factoryAuthenticationRepository.js";
import { IAuthentication, IAuthenticationRepository, IAuthenticationService, IExternalAuthenticationRepository, IExternalAuthenticationService } from "../Interfaces/authInterfaces.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import HttpError from "../../utils/customErrors/httpError.js";
import Authentication from "../models/authenticationModel.js";

import dotenv from "dotenv";
import { IProfile } from "../../_Autorização/Interfaces/profileInterfaces.js";
import externalAuthenticationService from "./externalAuthenticationService.js";
dotenv.config();

class AuthenticationService implements IAuthenticationService {
    private static instance: AuthenticationService;
    private authRepository: IAuthenticationRepository;
    private externalAuthenticationService: IExternalAuthenticationService

    /**
     * Private constructor to create the AuthenticationService instance.
     * This constructor is private to force the use of the singleton pattern.
     * The authentication repository is created here and stored in the instance.
     */
    private constructor() {
        this.authRepository = createAuthenticationRepository();
        this.externalAuthenticationService = externalAuthenticationService.getInstance()
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
     * @inheritdoc
     */
    async findAll(): Promise<IAuthentication[]> {
        return await this.authRepository.findAll();
    }
    
    /**
     * @inheritdoc
     */
    async findById(id: string): Promise<IAuthentication | null> {
        return await this.authRepository.findById(id);
    }

    /**
     * @inheritdoc
     */
    async findByLogin(login: string): Promise<IAuthentication | null> {
        return await this.authRepository.findByLogin(login);
    }

    /**
     * @inheritdoc
     */
    async createStandartAuthentication(authData: Partial<IAuthentication>): Promise<IAuthentication> {    
                   
            if (await this.authRepository.findByLogin(authData.login!)) {
                throw new HttpError(409, 'Authentication already exists');
            }

            const salt = bcrypt.genSaltSync(10);
            const password = await bcrypt.hash(authData.passwordHash!, salt);
            authData.passwordHash = password;

            const auth = Authentication.create(authData);
            
            const newAuth = await this.authRepository.createAuthentication(auth);
            if(!newAuth) {
                throw new HttpError(400, 'Authentication not created');
            }
            return newAuth;
    }

    /**
     * @inheritdoc
     */
    async updateAuthentication(id: string, authData: IAuthentication): Promise<IAuthentication> {
        const auth = await this.authRepository.findById(id);
        if (!auth) {
            throw new HttpError(404, 'Authentication not found');
        }

        if ( (await this.externalAuthenticationService.findAllByAuthenticationId(id)).length > 0) {
            throw new HttpError( 409, "Por favor remova todas as autenticações externas para poder atualizar o cadastro" );
        }
        
        const filteredData = Object.entries(authData)
            .filter(([_, value]) => value !== null && value !== undefined && 
                !(typeof value === 'string' && value.trim() === ''))
            .reduce((acc, [key, value]) => {
                acc[key as keyof IAuthentication] = value as any
                return acc
            }, {} as Partial<IAuthentication>)

        if (Object.keys(filteredData).length === 0) {
            throw new HttpError(400, 'No data to update');
        }

        return await this.authRepository.updateAuthentication(id, filteredData);
        
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    async validatePassword(id: string, passwordHash: string): Promise<boolean> {
        const auth = await this.authRepository.findByIdWithPassword(id);

        if (!auth || !auth.passwordHash) {
            throw new HttpError(404, 'Authentication not found');
        }
        return bcrypt.compare(passwordHash, auth.passwordHash);
    }

    /**
     * @inheritdoc
     */
    async authenticate(login: string, passwordHash: string): Promise<IAuthentication | null> {
        const auth: IAuthentication | null = await this.authRepository.findByLogin(login);
        
        if (!auth) {
            return null;
        }

        if(auth.active === false) {
            throw new HttpError(403, 'Usuário inativo');
        }

        if (!await this.validatePassword(auth.id!, passwordHash)) {
            throw new HttpError(401, 'Login ou senha inválidos');
        }
        return auth || null;
    };   
        
    /**
     * @inheritdoc
     */
    async deactivateAccountAuthentication(id: string): Promise<void> {
        await this.authRepository.updateAuthentication(id, {active: false});
    }

    /**
     * @inheritdoc
     */
    async activateAccountAuthentication(id: string): Promise<void> {
        await this.authRepository.updateAuthentication(id, {active: true});
    }



    async getProfilesByAuthenticationId(id: string): Promise<IProfile[]> {
        const authentication = await this.findById(id);
            
        if (!authentication) {
            throw new HttpError(404, 'Authentication not found');
        }

        const profiles = await this.authRepository.getProfilesByAuthentication(authentication);
        if (!profiles) {
            throw new HttpError(404, 'Profiles not found');
        }

        return profiles;
    }
}
export default AuthenticationService;